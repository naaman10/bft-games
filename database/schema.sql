-- Gem Hunt Database Schema
-- PostgreSQL / Neon Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    year_group VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    current_level INT DEFAULT 1,
    total_gems INT DEFAULT 0,
    lives_remaining INT DEFAULT 5,
    moves_remaining INT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_sessions_active ON game_sessions(user_id, completed) WHERE completed = FALSE;
CREATE INDEX idx_sessions_year_subject ON game_sessions(year_group, subject);

-- Level progress table
CREATE TABLE IF NOT EXISTS level_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_id UUID,
    year_group VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    level_number INT NOT NULL,
    gems_collected INT DEFAULT 0,
    moves_used INT DEFAULT 0,
    questions_answered INT DEFAULT 0,
    questions_correct INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_taken_seconds INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE SET NULL,
    UNIQUE(user_id, year_group, subject, level_number, session_id)
);

CREATE INDEX idx_progress_user ON level_progress(user_id);
CREATE INDEX idx_progress_user_year_subject ON level_progress(user_id, year_group, subject);
CREATE INDEX idx_progress_completed ON level_progress(completed, completed_at);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    year_group VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    total_gems INT DEFAULT 0,
    highest_level INT DEFAULT 1,
    total_games_played INT DEFAULT 0,
    total_time_played_seconds INT DEFAULT 0,
    average_accuracy DECIMAL(5, 2) DEFAULT 0.0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, year_group, subject)
);

CREATE INDEX idx_leaderboard_ranking ON leaderboard(year_group, subject, total_gems DESC);
CREATE INDEX idx_leaderboard_user ON leaderboard(user_id);

-- Question bank table
CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year_group VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    alternative_answers TEXT[], -- Array of acceptable alternative answers
    hint TEXT,
    explanation TEXT,
    difficulty_level INT DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 3),
    times_asked INT DEFAULT 0,
    times_correct INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_questions_year_subject ON question_bank(year_group, subject, active);
CREATE INDEX idx_questions_difficulty ON question_bank(difficulty_level);
CREATE INDEX idx_questions_active ON question_bank(active) WHERE active = TRUE;

-- Question responses table
CREATE TABLE IF NOT EXISTS question_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    question_id UUID NOT NULL,
    user_answer VARCHAR(255),
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds INT,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE
);

CREATE INDEX idx_responses_session ON question_responses(session_id);
CREATE INDEX idx_responses_question ON question_responses(question_id);
CREATE INDEX idx_responses_correctness ON question_responses(is_correct);

-- Achievements table (optional for future)
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon_url VARCHAR(500),
    requirement_type VARCHAR(50) NOT NULL, -- 'gems', 'levels', 'streak', etc.
    requirement_value INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_achievement FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements ON user_achievements(user_id);

-- Functions and Triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to question_bank table
CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON question_bank
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard_entry(
    p_user_id UUID,
    p_year_group VARCHAR,
    p_subject VARCHAR,
    p_gems INT,
    p_level INT,
    p_time_seconds INT,
    p_accuracy DECIMAL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO leaderboard (
        user_id, 
        year_group, 
        subject, 
        total_gems, 
        highest_level,
        total_games_played,
        total_time_played_seconds,
        average_accuracy,
        last_updated
    )
    VALUES (
        p_user_id,
        p_year_group,
        p_subject,
        p_gems,
        p_level,
        1,
        p_time_seconds,
        p_accuracy,
        NOW()
    )
    ON CONFLICT (user_id, year_group, subject)
    DO UPDATE SET
        total_gems = leaderboard.total_gems + p_gems,
        highest_level = GREATEST(leaderboard.highest_level, p_level),
        total_games_played = leaderboard.total_games_played + 1,
        total_time_played_seconds = leaderboard.total_time_played_seconds + p_time_seconds,
        average_accuracy = (leaderboard.average_accuracy * leaderboard.total_games_played + p_accuracy) / (leaderboard.total_games_played + 1),
        last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get random questions
CREATE OR REPLACE FUNCTION get_random_questions(
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
    SELECT 
        qb.id,
        qb.question_text,
        qb.year_group,
        qb.subject,
        qb.difficulty_level
    FROM question_bank qb
    WHERE qb.year_group = p_year_group
        AND qb.subject = p_subject
        AND qb.active = TRUE
        AND (p_difficulty IS NULL OR qb.difficulty_level = p_difficulty)
    ORDER BY RANDOM()
    LIMIT p_count;
END;
$$ LANGUAGE plpgsql;

-- Function to increment question statistics
CREATE OR REPLACE FUNCTION update_question_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE question_bank
    SET 
        times_asked = times_asked + 1,
        times_correct = times_correct + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END
    WHERE id = NEW.question_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_statistics
    AFTER INSERT ON question_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_question_stats();

-- Views

-- Leaderboard view with user details
CREATE OR REPLACE VIEW leaderboard_with_users AS
SELECT 
    l.id,
    l.user_id,
    u.username,
    l.year_group,
    l.subject,
    l.total_gems,
    l.highest_level,
    l.total_games_played,
    l.total_time_played_seconds,
    l.average_accuracy,
    l.last_updated,
    RANK() OVER (PARTITION BY l.year_group, l.subject ORDER BY l.total_gems DESC) as rank
FROM leaderboard l
JOIN users u ON l.user_id = u.id;

-- User progress summary view
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    u.id as user_id,
    u.username,
    lp.year_group,
    lp.subject,
    COUNT(DISTINCT lp.level_number) as levels_completed,
    MAX(lp.level_number) as highest_level,
    SUM(lp.gems_collected) as total_gems,
    SUM(lp.questions_answered) as total_questions,
    SUM(lp.questions_correct) as total_correct,
    ROUND(
        CASE 
            WHEN SUM(lp.questions_answered) > 0 
            THEN (SUM(lp.questions_correct)::DECIMAL / SUM(lp.questions_answered) * 100)
            ELSE 0 
        END, 
        2
    ) as accuracy_percentage
FROM users u
LEFT JOIN level_progress lp ON u.id = lp.user_id AND lp.completed = TRUE
GROUP BY u.id, u.username, lp.year_group, lp.subject;

-- Sample data inserts

-- Sample questions for Year 6 Percentages
INSERT INTO question_bank (year_group, subject, question_text, correct_answer, difficulty_level) VALUES
('Year 6', 'Percentages', 'What is 25% of 80?', '20', 1),
('Year 6', 'Percentages', 'What is 50% of 120?', '60', 1),
('Year 6', 'Percentages', 'What is 10% of 200?', '20', 1),
('Year 6', 'Percentages', 'What is 75% of 40?', '30', 2),
('Year 6', 'Percentages', 'What is 20% of 150?', '30', 1),
('Year 6', 'Percentages', 'What is 30% of 100?', '30', 1),
('Year 6', 'Percentages', 'What is 15% of 80?', '12', 2),
('Year 6', 'Percentages', 'What is 60% of 50?', '30', 2),
('Year 6', 'Percentages', 'What is 5% of 200?', '10', 1),
('Year 6', 'Percentages', 'What is 40% of 75?', '30', 2);

-- Comments
COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE game_sessions IS 'Tracks individual game sessions with progress';
COMMENT ON TABLE level_progress IS 'Records user progress for each level';
COMMENT ON TABLE leaderboard IS 'Aggregated leaderboard rankings by year/subject';
COMMENT ON TABLE question_bank IS 'Repository of all questions for the game';
COMMENT ON TABLE question_responses IS 'Individual question answer records';
COMMENT ON TABLE achievements IS 'Available achievements in the game';
COMMENT ON TABLE user_achievements IS 'Achievements unlocked by users';
