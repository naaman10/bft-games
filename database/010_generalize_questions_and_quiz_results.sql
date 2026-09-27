-- Migration: Rename gem_hunt_questions to generic 'questions' table
-- and create quiz_results table for all games
-- 
-- This migration makes the questions table usable by all games, not just Gem Hunt
-- and creates a general quiz results tracking system

-- Step 1: Rename the questions table
ALTER TABLE IF EXISTS gem_hunt_questions RENAME TO questions;

-- Step 2: Update all indexes to reference new table name
DROP INDEX IF EXISTS idx_gem_hunt_questions_year_subject;
DROP INDEX IF EXISTS idx_gem_hunt_questions_difficulty;
DROP INDEX IF EXISTS idx_gem_hunt_questions_active;

CREATE INDEX IF NOT EXISTS idx_questions_year_subject ON questions(year_group, subject, active);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(active) WHERE active = TRUE;

-- Step 3: Update the trigger name
DROP TRIGGER IF EXISTS update_gem_hunt_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Update function that references the table
CREATE OR REPLACE FUNCTION get_random_questions(
    p_year_group VARCHAR,
    p_subject VARCHAR DEFAULT NULL,
    p_count INT DEFAULT 5,
    p_difficulty INT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    year_group VARCHAR,
    subject VARCHAR,
    difficulty_level INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.question_text,
        q.year_group,
        q.subject,
        q.difficulty_level
    FROM questions q
    WHERE q.year_group = p_year_group
        AND (p_subject IS NULL OR q.subject = p_subject)
        AND q.active = TRUE
        AND (p_difficulty IS NULL OR q.difficulty_level = p_difficulty)
    ORDER BY RANDOM()
    LIMIT p_count;
END;
$$ LANGUAGE plpgsql;

-- Keep the old function for backwards compatibility with Gem Hunt
CREATE OR REPLACE FUNCTION get_gem_hunt_random_questions(
    p_year_group VARCHAR,
    p_subject VARCHAR,
    p_count INT DEFAULT 5,
    p_difficulty INT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    year_group VARCHAR,
    subject VARCHAR,
    difficulty_level INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM get_random_questions(p_year_group, p_subject, p_count, p_difficulty);
END;
$$ LANGUAGE plpgsql;

-- Step 5: Update the question stats trigger function
CREATE OR REPLACE FUNCTION update_question_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE questions
    SET
        times_asked = times_asked + 1,
        times_correct = times_correct + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END
    WHERE id = NEW.question_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update Gem Hunt trigger to use new function
DROP TRIGGER IF EXISTS update_gem_hunt_question_statistics ON gem_hunt_question_responses;
CREATE TRIGGER update_gem_hunt_question_statistics
    AFTER INSERT ON gem_hunt_question_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_question_stats();

-- Step 6: Create generic quiz_results table for all quiz-based games
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL, -- 'quiz_generator', 'gem_hunt', etc.
    year_group VARCHAR(50) NOT NULL,
    subject VARCHAR(100), -- NULL means "all subjects"
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    incorrect_answers INT NOT NULL,
    score_percentage DECIMAL(5, 2) NOT NULL,
    time_taken_seconds INT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_student ON quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_game ON quiz_results(game_type);
CREATE INDEX IF NOT EXISTS idx_quiz_results_year_subject ON quiz_results(year_group, subject);
CREATE INDEX IF NOT EXISTS idx_quiz_results_completed ON quiz_results(completed_at);

-- Step 7: Create quiz_question_responses table for detailed tracking
CREATE TABLE IF NOT EXISTS quiz_question_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_result_id UUID NOT NULL REFERENCES quiz_results(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    user_answer VARCHAR(255),
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds INT,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz ON quiz_question_responses(quiz_result_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_question ON quiz_question_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_correctness ON quiz_question_responses(is_correct);

-- Step 8: Add trigger to update question stats from quiz responses
DROP TRIGGER IF EXISTS update_question_statistics_from_quiz ON quiz_question_responses;
CREATE TRIGGER update_question_statistics_from_quiz
    AFTER INSERT ON quiz_question_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_question_stats();

-- Step 9: Create view for quiz analytics
CREATE OR REPLACE VIEW quiz_results_summary AS
SELECT
    qr.id,
    qr.student_id,
    s.name as student_name,
    s.email as student_email,
    qr.game_type,
    qr.year_group,
    qr.subject,
    qr.total_questions,
    qr.correct_answers,
    qr.incorrect_answers,
    qr.score_percentage,
    qr.time_taken_seconds,
    ROUND(qr.time_taken_seconds::DECIMAL / qr.total_questions, 2) as avg_seconds_per_question,
    qr.started_at,
    qr.completed_at,
    EXTRACT(EPOCH FROM (qr.completed_at - qr.started_at)) as duration_seconds
FROM quiz_results qr
JOIN students s ON qr.student_id = s.id;

-- Step 10: Create view for student quiz performance over time
CREATE OR REPLACE VIEW student_quiz_performance AS
SELECT
    s.id as student_id,
    s.name as student_name,
    qr.game_type,
    qr.year_group,
    qr.subject,
    COUNT(*) as total_quizzes,
    AVG(qr.score_percentage) as avg_score_percentage,
    MAX(qr.score_percentage) as best_score_percentage,
    MIN(qr.score_percentage) as worst_score_percentage,
    SUM(qr.total_questions) as total_questions_attempted,
    SUM(qr.correct_answers) as total_correct,
    SUM(qr.incorrect_answers) as total_incorrect,
    AVG(qr.time_taken_seconds) as avg_time_seconds,
    MAX(qr.completed_at) as last_quiz_date
FROM students s
JOIN quiz_results qr ON s.id = qr.student_id
GROUP BY s.id, s.name, qr.game_type, qr.year_group, qr.subject;

-- Step 11: Update table comments
COMMENT ON TABLE questions IS 'Generic questions table for all math games (formerly gem_hunt_questions)';
COMMENT ON TABLE quiz_results IS 'Quiz completion records for all quiz-based games';
COMMENT ON TABLE quiz_question_responses IS 'Individual question responses within quiz sessions';

-- Step 12: Add function to get subject list for a year group
CREATE OR REPLACE FUNCTION get_available_subjects(p_year_group VARCHAR)
RETURNS TABLE(subject VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT q.subject
    FROM questions q
    WHERE q.year_group = p_year_group
        AND q.active = TRUE
    ORDER BY q.subject;
END;
$$ LANGUAGE plpgsql;

-- Step 13: Add function to get year groups
CREATE OR REPLACE FUNCTION get_available_year_groups()
RETURNS TABLE(year_group VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT q.year_group
    FROM questions q
    WHERE q.active = TRUE
    ORDER BY q.year_group;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_random_questions IS 'Get random questions for any game, optionally filtering by subject';
COMMENT ON FUNCTION get_available_subjects IS 'Get list of available subjects for a year group';
COMMENT ON FUNCTION get_available_year_groups IS 'Get list of all available year groups';
