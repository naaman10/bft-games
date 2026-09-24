-- Gem Hunt Question Bank Population
-- Run this after the main migration (009_gem_hunt_tables.sql)
-- Populates the gem_hunt_questions table with questions for Years 1-6

-- Clear existing questions (optional - comment out if you want to keep existing)
-- TRUNCATE TABLE gem_hunt_questions;

-- ============================================
-- YEAR 1 QUESTIONS
-- ============================================

-- Year 1: Addition (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 1', 'Addition', 'What is 2 + 3?', '5', ARRAY['five'], 1, 'Count on your fingers from 2', '2 plus 3 equals 5'),
('Year 1', 'Addition', 'What is 5 + 4?', '9', ARRAY['nine'], 1, 'Start at 5 and count up 4', '5 plus 4 equals 9'),
('Year 1', 'Addition', 'What is 1 + 6?', '7', ARRAY['seven'], 1, 'Count from 1', '1 plus 6 equals 7'),
('Year 1', 'Addition', 'What is 3 + 3?', '6', ARRAY['six'], 1, 'Double 3', '3 plus 3 equals 6'),
('Year 1', 'Addition', 'What is 4 + 2?', '6', ARRAY['six'], 1, 'Start at 4 and add 2', '4 plus 2 equals 6'),
('Year 1', 'Addition', 'What is 7 + 2?', '9', ARRAY['nine'], 1, 'Count up from 7', '7 plus 2 equals 9'),
('Year 1', 'Addition', 'What is 6 + 3?', '9', ARRAY['nine'], 1, 'Start at 6 and add 3', '6 plus 3 equals 9'),
('Year 1', 'Addition', 'What is 8 + 1?', '9', ARRAY['nine'], 1, 'Adding 1 is easy', '8 plus 1 equals 9'),
('Year 1', 'Addition', 'What is 2 + 2?', '4', ARRAY['four'], 1, 'Double 2', '2 plus 2 equals 4'),
('Year 1', 'Addition', 'What is 5 + 5?', '10', ARRAY['ten'], 2, 'Double 5', '5 plus 5 equals 10'),
('Year 1', 'Addition', 'What is 3 + 4?', '7', ARRAY['seven'], 1, 'Count up from 3', '3 plus 4 equals 7'),
('Year 1', 'Addition', 'What is 6 + 2?', '8', ARRAY['eight'], 1, 'Start at 6', '6 plus 2 equals 8'),
('Year 1', 'Addition', 'What is 7 + 3?', '10', ARRAY['ten'], 2, 'Make 10', '7 plus 3 equals 10'),
('Year 1', 'Addition', 'What is 4 + 5?', '9', ARRAY['nine'], 1, 'Count from 4', '4 plus 5 equals 9'),
('Year 1', 'Addition', 'What is 2 + 7?', '9', ARRAY['nine'], 1, 'Start at 2', '2 plus 7 equals 9');

-- Year 1: Subtraction (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 1', 'Subtraction', 'What is 5 - 2?', '3', ARRAY['three'], 1, 'Count back from 5', '5 minus 2 equals 3'),
('Year 1', 'Subtraction', 'What is 8 - 3?', '5', ARRAY['five'], 1, 'Take away 3 from 8', '8 minus 3 equals 5'),
('Year 1', 'Subtraction', 'What is 10 - 4?', '6', ARRAY['six'], 2, 'Count back from 10', '10 minus 4 equals 6'),
('Year 1', 'Subtraction', 'What is 7 - 1?', '6', ARRAY['six'], 1, 'One less than 7', '7 minus 1 equals 6'),
('Year 1', 'Subtraction', 'What is 9 - 5?', '4', ARRAY['four'], 2, 'Count back from 9', '9 minus 5 equals 4'),
('Year 1', 'Subtraction', 'What is 6 - 3?', '3', ARRAY['three'], 1, 'Half of 6', '6 minus 3 equals 3'),
('Year 1', 'Subtraction', 'What is 4 - 2?', '2', ARRAY['two'], 1, 'Half of 4', '4 minus 2 equals 2'),
('Year 1', 'Subtraction', 'What is 10 - 5?', '5', ARRAY['five'], 1, 'Half of 10', '10 minus 5 equals 5'),
('Year 1', 'Subtraction', 'What is 8 - 4?', '4', ARRAY['four'], 1, 'Half of 8', '8 minus 4 equals 4'),
('Year 1', 'Subtraction', 'What is 9 - 3?', '6', ARRAY['six'], 1, 'Count back 3', '9 minus 3 equals 6'),
('Year 1', 'Subtraction', 'What is 7 - 4?', '3', ARRAY['three'], 1, 'Take away 4', '7 minus 4 equals 3'),
('Year 1', 'Subtraction', 'What is 6 - 2?', '4', ARRAY['four'], 1, 'Count back 2', '6 minus 2 equals 4'),
('Year 1', 'Subtraction', 'What is 10 - 3?', '7', ARRAY['seven'], 2, 'Count back from 10', '10 minus 3 equals 7'),
('Year 1', 'Subtraction', 'What is 9 - 2?', '7', ARRAY['seven'], 1, 'Take away 2', '9 minus 2 equals 7'),
('Year 1', 'Subtraction', 'What is 8 - 5?', '3', ARRAY['three'], 2, 'Count back 5', '8 minus 5 equals 3');

-- ============================================
-- YEAR 2 QUESTIONS
-- ============================================

-- Year 2: Addition (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 2', 'Addition', 'What is 15 + 12?', '27', NULL, 1, 'Add the tens, then the ones', '15 plus 12 equals 27'),
('Year 2', 'Addition', 'What is 23 + 14?', '37', NULL, 1, 'Start with 23', '23 plus 14 equals 37'),
('Year 2', 'Addition', 'What is 18 + 9?', '27', NULL, 2, 'Think about making tens', '18 plus 9 equals 27'),
('Year 2', 'Addition', 'What is 25 + 15?', '40', ARRAY['forty'], 1, 'Two lots of 20', '25 plus 15 equals 40'),
('Year 2', 'Addition', 'What is 17 + 13?', '30', ARRAY['thirty'], 2, 'Make 30', '17 plus 13 equals 30'),
('Year 2', 'Addition', 'What is 34 + 21?', '55', NULL, 1, 'Add tens first', '34 plus 21 equals 55'),
('Year 2', 'Addition', 'What is 42 + 16?', '58', NULL, 2, 'Break into tens and ones', '42 plus 16 equals 58'),
('Year 2', 'Addition', 'What is 29 + 11?', '40', ARRAY['forty'], 2, 'Nearly 30 plus 10', '29 plus 11 equals 40'),
('Year 2', 'Addition', 'What is 35 + 25?', '60', ARRAY['sixty'], 1, '30 plus 30', '35 plus 25 equals 60'),
('Year 2', 'Addition', 'What is 48 + 12?', '60', ARRAY['sixty'], 2, 'Nearly 50 plus 10', '48 plus 12 equals 60'),
('Year 2', 'Addition', 'What is 27 + 18?', '45', NULL, 2, 'Make 30 first', '27 plus 18 equals 45'),
('Year 2', 'Addition', 'What is 36 + 14?', '50', ARRAY['fifty'], 2, 'Make 50', '36 plus 14 equals 50'),
('Year 2', 'Addition', 'What is 19 + 21?', '40', ARRAY['forty'], 1, 'Nearly 20 plus 20', '19 plus 21 equals 40'),
('Year 2', 'Addition', 'What is 33 + 17?', '50', ARRAY['fifty'], 2, 'Make 50', '33 plus 17 equals 50'),
('Year 2', 'Addition', 'What is 44 + 26?', '70', ARRAY['seventy'], 2, 'Add carefully', '44 plus 26 equals 70');

-- Year 2: Multiplication (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 2', 'Multiplication', 'What is 2 × 2?', '4', ARRAY['four'], 1, 'Double 2', '2 times 2 equals 4'),
('Year 2', 'Multiplication', 'What is 2 × 5?', '10', ARRAY['ten'], 1, 'Count in 2s', '2 times 5 equals 10'),
('Year 2', 'Multiplication', 'What is 3 × 2?', '6', ARRAY['six'], 1, 'Double 3', '3 times 2 equals 6'),
('Year 2', 'Multiplication', 'What is 5 × 2?', '10', ARRAY['ten'], 1, 'Double 5', '5 times 2 equals 10'),
('Year 2', 'Multiplication', 'What is 4 × 2?', '8', ARRAY['eight'], 1, 'Double 4', '4 times 2 equals 8'),
('Year 2', 'Multiplication', 'What is 10 × 2?', '20', ARRAY['twenty'], 1, 'Double 10', '10 times 2 equals 20'),
('Year 2', 'Multiplication', 'What is 2 × 3?', '6', ARRAY['six'], 1, 'Count in 2s', '2 times 3 equals 6'),
('Year 2', 'Multiplication', 'What is 2 × 4?', '8', ARRAY['eight'], 1, 'Count in 2s', '2 times 4 equals 8'),
('Year 2', 'Multiplication', 'What is 5 × 5?', '25', NULL, 2, '5 fives', '5 times 5 equals 25'),
('Year 2', 'Multiplication', 'What is 10 × 5?', '50', ARRAY['fifty'], 2, 'Count in 10s', '10 times 5 equals 50'),
('Year 2', 'Multiplication', 'What is 2 × 10?', '20', ARRAY['twenty'], 1, 'Double 10', '2 times 10 equals 20'),
('Year 2', 'Multiplication', 'What is 5 × 3?', '15', NULL, 2, 'Count in 5s', '5 times 3 equals 15'),
('Year 2', 'Multiplication', 'What is 5 × 4?', '20', ARRAY['twenty'], 2, 'Count in 5s', '5 times 4 equals 20'),
('Year 2', 'Multiplication', 'What is 10 × 3?', '30', ARRAY['thirty'], 1, 'Count in 10s', '10 times 3 equals 30'),
('Year 2', 'Multiplication', 'What is 10 × 4?', '40', ARRAY['forty'], 1, 'Count in 10s', '10 times 4 equals 40');

-- ============================================
-- YEAR 3 QUESTIONS
-- ============================================

-- Year 3: Addition (12 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 3', 'Addition', 'What is 145 + 237?', '382', NULL, 2, 'Add column by column', '145 plus 237 equals 382'),
('Year 3', 'Addition', 'What is 328 + 156?', '484', NULL, 2, 'Use column addition', '328 plus 156 equals 484'),
('Year 3', 'Addition', 'What is 267 + 189?', '456', NULL, 3, 'Remember to carry', '267 plus 189 equals 456'),
('Year 3', 'Addition', 'What is 412 + 298?', '710', NULL, 3, 'Nearly 300', '412 plus 298 equals 710'),
('Year 3', 'Addition', 'What is 555 + 345?', '900', NULL, 2, 'Add hundreds first', '555 plus 345 equals 900'),
('Year 3', 'Addition', 'What is 234 + 456?', '690', NULL, 2, 'Column addition', '234 plus 456 equals 690'),
('Year 3', 'Addition', 'What is 378 + 122?', '500', NULL, 2, 'Make 500', '378 plus 122 equals 500'),
('Year 3', 'Addition', 'What is 467 + 233?', '700', NULL, 2, 'Make 700', '467 plus 233 equals 700'),
('Year 3', 'Addition', 'What is 189 + 211?', '400', NULL, 2, 'Make 400', '189 plus 211 equals 400'),
('Year 3', 'Addition', 'What is 345 + 255?', '600', NULL, 2, 'Add hundreds', '345 plus 255 equals 600'),
('Year 3', 'Addition', 'What is 428 + 372?', '800', NULL, 3, 'Make 800', '428 plus 372 equals 800'),
('Year 3', 'Addition', 'What is 567 + 133?', '700', NULL, 2, 'Add carefully', '567 plus 133 equals 700');

-- Year 3: Multiplication (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 3', 'Multiplication', 'What is 6 × 4?', '24', NULL, 1, 'Count in 6s', '6 times 4 equals 24'),
('Year 3', 'Multiplication', 'What is 7 × 3?', '21', NULL, 1, 'Count in 7s', '7 times 3 equals 21'),
('Year 3', 'Multiplication', 'What is 8 × 5?', '40', ARRAY['forty'], 2, 'Count in 8s', '8 times 5 equals 40'),
('Year 3', 'Multiplication', 'What is 9 × 3?', '27', NULL, 2, 'Count in 9s', '9 times 3 equals 27'),
('Year 3', 'Multiplication', 'What is 6 × 7?', '42', NULL, 2, '6 sevens', '6 times 7 equals 42'),
('Year 3', 'Multiplication', 'What is 4 × 8?', '32', NULL, 2, '4 eights', '4 times 8 equals 32'),
('Year 3', 'Multiplication', 'What is 3 × 9?', '27', NULL, 2, '3 nines', '3 times 9 equals 27'),
('Year 3', 'Multiplication', 'What is 7 × 7?', '49', NULL, 2, '7 sevens', '7 times 7 equals 49'),
('Year 3', 'Multiplication', 'What is 8 × 8?', '64', NULL, 3, '8 eights', '8 times 8 equals 64'),
('Year 3', 'Multiplication', 'What is 6 × 6?', '36', NULL, 2, '6 sixes', '6 times 6 equals 36'),
('Year 3', 'Multiplication', 'What is 9 × 4?', '36', NULL, 2, 'Count in 9s', '9 times 4 equals 36'),
('Year 3', 'Multiplication', 'What is 7 × 8?', '56', NULL, 3, '7 eights', '7 times 8 equals 56'),
('Year 3', 'Multiplication', 'What is 6 × 9?', '54', NULL, 3, '6 nines', '6 times 9 equals 54'),
('Year 3', 'Multiplication', 'What is 12 × 5?', '60', ARRAY['sixty'], 2, 'Think of 10 × 5', '12 times 5 equals 60'),
('Year 3', 'Multiplication', 'What is 11 × 4?', '44', NULL, 2, 'Multiply by 10, then add', '11 times 4 equals 44');

-- Year 3: Division (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 3', 'Division', 'What is 12 ÷ 3?', '4', ARRAY['four'], 1, 'How many 3s in 12?', '12 divided by 3 equals 4'),
('Year 3', 'Division', 'What is 20 ÷ 4?', '5', ARRAY['five'], 1, 'How many 4s in 20?', '20 divided by 4 equals 5'),
('Year 3', 'Division', 'What is 15 ÷ 5?', '3', ARRAY['three'], 1, 'How many 5s in 15?', '15 divided by 5 equals 3'),
('Year 3', 'Division', 'What is 18 ÷ 2?', '9', ARRAY['nine'], 1, 'Half of 18', '18 divided by 2 equals 9'),
('Year 3', 'Division', 'What is 24 ÷ 6?', '4', ARRAY['four'], 2, 'How many 6s?', '24 divided by 6 equals 4'),
('Year 3', 'Division', 'What is 28 ÷ 4?', '7', ARRAY['seven'], 2, 'Use your 4 times table', '28 divided by 4 equals 7'),
('Year 3', 'Division', 'What is 36 ÷ 6?', '6', ARRAY['six'], 2, '6 times what is 36?', '36 divided by 6 equals 6'),
('Year 3', 'Division', 'What is 40 ÷ 5?', '8', ARRAY['eight'], 1, 'Count in 5s', '40 divided by 5 equals 8'),
('Year 3', 'Division', 'What is 27 ÷ 3?', '9', ARRAY['nine'], 2, 'Use your 3 times table', '27 divided by 3 equals 9'),
('Year 3', 'Division', 'What is 32 ÷ 4?', '8', ARRAY['eight'], 2, 'Use your 4 times table', '32 divided by 4 equals 8'),
('Year 3', 'Division', 'What is 45 ÷ 5?', '9', ARRAY['nine'], 2, 'Count in 5s', '45 divided by 5 equals 9'),
('Year 3', 'Division', 'What is 35 ÷ 7?', '5', ARRAY['five'], 2, 'Use your 7 times table', '35 divided by 7 equals 5'),
('Year 3', 'Division', 'What is 48 ÷ 8?', '6', ARRAY['six'], 3, 'Use your 8 times table', '48 divided by 8 equals 6'),
('Year 3', 'Division', 'What is 54 ÷ 6?', '9', ARRAY['nine'], 3, '6 times what?', '54 divided by 6 equals 9'),
('Year 3', 'Division', 'What is 63 ÷ 9?', '7', ARRAY['seven'], 3, 'Use your 9 times table', '63 divided by 9 equals 7');

-- ============================================
-- YEAR 4 QUESTIONS
-- ============================================

-- Year 4: Multiplication (12 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 4', 'Multiplication', 'What is 12 × 8?', '96', NULL, 2, 'Use your tables', '12 times 8 equals 96'),
('Year 4', 'Multiplication', 'What is 15 × 6?', '90', ARRAY['ninety'], 2, 'Think of 10 × 6 plus 5 × 6', '15 times 6 equals 90'),
('Year 4', 'Multiplication', 'What is 11 × 9?', '99', NULL, 2, 'Nearly 100', '11 times 9 equals 99'),
('Year 4', 'Multiplication', 'What is 13 × 7?', '91', NULL, 3, 'Use your tables', '13 times 7 equals 91'),
('Year 4', 'Multiplication', 'What is 14 × 5?', '70', ARRAY['seventy'], 2, 'Double 7 × 5', '14 times 5 equals 70'),
('Year 4', 'Multiplication', 'What is 16 × 4?', '64', NULL, 2, 'Double 8 × 4', '16 times 4 equals 64'),
('Year 4', 'Multiplication', 'What is 18 × 3?', '54', NULL, 2, 'Break into smaller parts', '18 times 3 equals 54'),
('Year 4', 'Multiplication', 'What is 12 × 12?', '144', NULL, 3, '12 twelves', '12 times 12 equals 144'),
('Year 4', 'Multiplication', 'What is 25 × 4?', '100', ARRAY['one hundred'], 2, 'Quarter of 100', '25 times 4 equals 100'),
('Year 4', 'Multiplication', 'What is 20 × 6?', '120', NULL, 2, '2 × 6 × 10', '20 times 6 equals 120'),
('Year 4', 'Multiplication', 'What is 17 × 5?', '85', NULL, 3, 'Break down the calculation', '17 times 5 equals 85'),
('Year 4', 'Multiplication', 'What is 19 × 4?', '76', NULL, 3, 'Think of 20 × 4 minus 4', '19 times 4 equals 76');

-- Year 4: Division (12 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 4', 'Division', 'What is 72 ÷ 8?', '9', ARRAY['nine'], 2, 'Use your 8 times table', '72 divided by 8 equals 9'),
('Year 4', 'Division', 'What is 56 ÷ 7?', '8', ARRAY['eight'], 2, 'Use your 7 times table', '56 divided by 7 equals 8'),
('Year 4', 'Division', 'What is 81 ÷ 9?', '9', ARRAY['nine'], 2, '9 times what?', '81 divided by 9 equals 9'),
('Year 4', 'Division', 'What is 64 ÷ 8?', '8', ARRAY['eight'], 2, '8 times 8', '64 divided by 8 equals 8'),
('Year 4', 'Division', 'What is 48 ÷ 6?', '8', ARRAY['eight'], 2, 'Use your 6 times table', '48 divided by 6 equals 8'),
('Year 4', 'Division', 'What is 84 ÷ 7?', '12', NULL, 3, 'Use your 7 times table', '84 divided by 7 equals 12'),
('Year 4', 'Division', 'What is 96 ÷ 8?', '12', NULL, 3, 'Use your 8 times table', '96 divided by 8 equals 12'),
('Year 4', 'Division', 'What is 108 ÷ 9?', '12', NULL, 3, 'Use your 9 times table', '108 divided by 9 equals 12'),
('Year 4', 'Division', 'What is 144 ÷ 12?', '12', NULL, 3, '12 times 12', '144 divided by 12 equals 12'),
('Year 4', 'Division', 'What is 66 ÷ 6?', '11', NULL, 2, 'Use your 6 times table', '66 divided by 6 equals 11'),
('Year 4', 'Division', 'What is 77 ÷ 7?', '11', NULL, 2, 'Use your 7 times table', '77 divided by 7 equals 11'),
('Year 4', 'Division', 'What is 99 ÷ 9?', '11', NULL, 2, 'Use your 9 times table', '99 divided by 9 equals 11');

-- Year 4: Fractions (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 4', 'Fractions', 'What is 1/2 + 1/2?', '1', ARRAY['one', '2/2'], 1, 'Two halves make a whole', '1/2 plus 1/2 equals 1'),
('Year 4', 'Fractions', 'What is 1/4 + 1/4?', '1/2', ARRAY['2/4'], 2, 'Two quarters equal one half', '1/4 plus 1/4 equals 1/2'),
('Year 4', 'Fractions', 'What is 2/3 + 1/3?', '1', ARRAY['one', '3/3'], 1, 'Three thirds make a whole', '2/3 plus 1/3 equals 1'),
('Year 4', 'Fractions', 'What is 3/4 - 1/4?', '1/2', ARRAY['2/4'], 2, 'Take away one quarter', '3/4 minus 1/4 equals 1/2'),
('Year 4', 'Fractions', 'What is 5/6 - 1/6?', '2/3', ARRAY['4/6'], 2, 'Simplify your answer', '5/6 minus 1/6 equals 2/3'),
('Year 4', 'Fractions', 'What is 1/3 + 1/3?', '2/3', NULL, 1, 'Add the numerators', '1/3 plus 1/3 equals 2/3'),
('Year 4', 'Fractions', 'What is 3/5 + 1/5?', '4/5', NULL, 1, 'Add the numerators', '3/5 plus 1/5 equals 4/5'),
('Year 4', 'Fractions', 'What is 7/8 - 3/8?', '1/2', ARRAY['4/8'], 2, 'Simplify', '7/8 minus 3/8 equals 1/2'),
('Year 4', 'Fractions', 'What is 1/2 + 1/4?', '3/4', NULL, 3, 'Convert to quarters', '1/2 plus 1/4 equals 3/4'),
('Year 4', 'Fractions', 'What is 1 - 1/3?', '2/3', NULL, 2, 'Think of 1 as 3/3', '1 minus 1/3 equals 2/3'),
('Year 4', 'Fractions', 'What is 1 - 1/4?', '3/4', NULL, 2, 'Think of 1 as 4/4', '1 minus 1/4 equals 3/4'),
('Year 4', 'Fractions', 'What is 1/2 of 10?', '5', ARRAY['five'], 2, 'Half of 10', '1/2 of 10 equals 5'),
('Year 4', 'Fractions', 'What is 1/4 of 20?', '5', ARRAY['five'], 2, 'Quarter of 20', '1/4 of 20 equals 5'),
('Year 4', 'Fractions', 'What is 1/3 of 12?', '4', ARRAY['four'], 2, 'Third of 12', '1/3 of 12 equals 4'),
('Year 4', 'Fractions', 'What is 2/5 of 10?', '4', ARRAY['four'], 3, 'Find 1/5 first', '2/5 of 10 equals 4');

-- ============================================
-- YEAR 5 QUESTIONS
-- ============================================

-- Year 5: Multiplication (12 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 5', 'Multiplication', 'What is 23 × 12?', '276', NULL, 3, 'Break into parts', '23 times 12 equals 276'),
('Year 5', 'Multiplication', 'What is 34 × 15?', '510', NULL, 3, 'Use grid method', '34 times 15 equals 510'),
('Year 5', 'Multiplication', 'What is 45 × 11?', '495', NULL, 2, 'Multiply by 10, then add', '45 times 11 equals 495'),
('Year 5', 'Multiplication', 'What is 28 × 13?', '364', NULL, 3, 'Break it down', '28 times 13 equals 364'),
('Year 5', 'Multiplication', 'What is 36 × 14?', '504', NULL, 3, 'Use column method', '36 times 14 equals 504'),
('Year 5', 'Multiplication', 'What is 42 × 16?', '672', NULL, 3, 'Break into parts', '42 times 16 equals 672'),
('Year 5', 'Multiplication', 'What is 25 × 24?', '600', NULL, 3, 'Think of 25 × 4 × 6', '25 times 24 equals 600'),
('Year 5', 'Multiplication', 'What is 18 × 15?', '270', NULL, 3, 'Break it down', '18 times 15 equals 270'),
('Year 5', 'Multiplication', 'What is 32 × 25?', '800', NULL, 3, 'Think of quarters', '32 times 25 equals 800'),
('Year 5', 'Multiplication', 'What is 27 × 12?', '324', NULL, 3, 'Use your method', '27 times 12 equals 324'),
('Year 5', 'Multiplication', 'What is 48 × 15?', '720', NULL, 3, 'Break into parts', '48 times 15 equals 720'),
('Year 5', 'Multiplication', 'What is 55 × 11?', '605', NULL, 2, 'Pattern with 11s', '55 times 11 equals 605');

-- Year 5: Fractions (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 5', 'Fractions', 'What is 1/3 + 1/6?', '1/2', ARRAY['3/6'], 2, 'Convert to sixths', '1/3 plus 1/6 equals 1/2'),
('Year 5', 'Fractions', 'What is 2/5 + 1/5?', '3/5', NULL, 1, 'Same denominator', '2/5 plus 1/5 equals 3/5'),
('Year 5', 'Fractions', 'What is 3/4 - 1/2?', '1/4', ARRAY['2/4'], 2, 'Convert to quarters', '3/4 minus 1/2 equals 1/4'),
('Year 5', 'Fractions', 'What is 2/3 - 1/6?', '1/2', ARRAY['3/6'], 2, 'Convert to sixths', '2/3 minus 1/6 equals 1/2'),
('Year 5', 'Fractions', 'What is 1/2 × 4?', '2', ARRAY['two'], 2, 'Half of 4', '1/2 times 4 equals 2'),
('Year 5', 'Fractions', 'What is 2/3 × 6?', '4', ARRAY['four'], 2, 'Two thirds of 6', '2/3 times 6 equals 4'),
('Year 5', 'Fractions', 'What is 3/5 + 1/5?', '4/5', NULL, 1, 'Add numerators', '3/5 plus 1/5 equals 4/5'),
('Year 5', 'Fractions', 'What is 5/8 - 1/8?', '1/2', ARRAY['4/8'], 2, 'Simplify', '5/8 minus 1/8 equals 1/2'),
('Year 5', 'Fractions', 'What is 1/4 + 1/2?', '3/4', NULL, 2, 'Convert to quarters', '1/4 plus 1/2 equals 3/4'),
('Year 5', 'Fractions', 'What is 7/10 - 2/10?', '1/2', ARRAY['5/10'], 2, 'Simplify', '7/10 minus 2/10 equals 1/2'),
('Year 5', 'Fractions', 'What is 1/3 of 15?', '5', ARRAY['five'], 2, 'Divide by 3', '1/3 of 15 equals 5'),
('Year 5', 'Fractions', 'What is 2/5 of 15?', '6', ARRAY['six'], 3, 'Find 1/5 first', '2/5 of 15 equals 6'),
('Year 5', 'Fractions', 'What is 3/4 of 16?', '12', NULL, 3, 'Find 1/4 first', '3/4 of 16 equals 12'),
('Year 5', 'Fractions', 'What is 5/6 + 1/6?', '1', ARRAY['one', '6/6'], 1, 'Makes a whole', '5/6 plus 1/6 equals 1'),
('Year 5', 'Fractions', 'What is 2/3 + 2/3?', '4/3', ARRAY['1 1/3'], 3, 'Improper fraction', '2/3 plus 2/3 equals 4/3');

-- Year 5: Decimals (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 5', 'Decimals', 'What is 2.5 + 3.7?', '6.2', NULL, 2, 'Line up decimal points', '2.5 plus 3.7 equals 6.2'),
('Year 5', 'Decimals', 'What is 5.8 + 2.3?', '8.1', NULL, 2, 'Add carefully', '5.8 plus 2.3 equals 8.1'),
('Year 5', 'Decimals', 'What is 7.6 - 2.4?', '5.2', NULL, 2, 'Line up decimals', '7.6 minus 2.4 equals 5.2'),
('Year 5', 'Decimals', 'What is 9.3 - 4.1?', '5.2', NULL, 2, 'Subtract carefully', '9.3 minus 4.1 equals 5.2'),
('Year 5', 'Decimals', 'What is 3.5 × 2?', '7', ARRAY['7.0'], 2, 'Double 3.5', '3.5 times 2 equals 7'),
('Year 5', 'Decimals', 'What is 4.2 × 3?', '12.6', NULL, 3, 'Multiply carefully', '4.2 times 3 equals 12.6'),
('Year 5', 'Decimals', 'What is 6.5 + 1.5?', '8', ARRAY['8.0'], 1, 'Add the parts', '6.5 plus 1.5 equals 8'),
('Year 5', 'Decimals', 'What is 10 - 3.5?', '6.5', NULL, 2, 'Count back', '10 minus 3.5 equals 6.5'),
('Year 5', 'Decimals', 'What is 8.4 - 3.2?', '5.2', NULL, 2, 'Subtract', '8.4 minus 3.2 equals 5.2'),
('Year 5', 'Decimals', 'What is 1.5 × 4?', '6', ARRAY['6.0'], 2, '1.5 four times', '1.5 times 4 equals 6'),
('Year 5', 'Decimals', 'What is 7.8 + 1.2?', '9', ARRAY['9.0'], 1, 'Make 9', '7.8 plus 1.2 equals 9'),
('Year 5', 'Decimals', 'What is 5.5 + 4.5?', '10', ARRAY['10.0'], 1, 'Make 10', '5.5 plus 4.5 equals 10'),
('Year 5', 'Decimals', 'What is 12.6 ÷ 3?', '4.2', NULL, 3, 'Divide carefully', '12.6 divided by 3 equals 4.2'),
('Year 5', 'Decimals', 'What is 8.5 - 2.5?', '6', ARRAY['6.0'], 2, 'Subtract', '8.5 minus 2.5 equals 6'),
('Year 5', 'Decimals', 'What is 2.25 × 2?', '4.5', ARRAY['4.50'], 3, 'Double it', '2.25 times 2 equals 4.5');

-- ============================================
-- YEAR 6 QUESTIONS
-- ============================================

-- Year 6: Percentages (20 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Percentages', 'What is 25% of 80?', '20', ARRAY['twenty'], 2, '25% is a quarter', '25% of 80 equals 20'),
('Year 6', 'Percentages', 'What is 50% of 120?', '60', ARRAY['sixty'], 1, '50% is half', '50% of 120 equals 60'),
('Year 6', 'Percentages', 'What is 10% of 200?', '20', ARRAY['twenty'], 1, 'Divide by 10', '10% of 200 equals 20'),
('Year 6', 'Percentages', 'What is 75% of 40?', '30', ARRAY['thirty'], 2, '75% is three quarters', '75% of 40 equals 30'),
('Year 6', 'Percentages', 'What is 20% of 150?', '30', ARRAY['thirty'], 2, 'Find 10% first', '20% of 150 equals 30'),
('Year 6', 'Percentages', 'What is 30% of 100?', '30', ARRAY['thirty'], 1, '30 out of 100', '30% of 100 equals 30'),
('Year 6', 'Percentages', 'What is 15% of 80?', '12', NULL, 3, 'Find 10% and 5%', '15% of 80 equals 12'),
('Year 6', 'Percentages', 'What is 60% of 50?', '30', ARRAY['thirty'], 2, 'More than half', '60% of 50 equals 30'),
('Year 6', 'Percentages', 'What is 5% of 200?', '10', ARRAY['ten'], 2, 'Half of 10%', '5% of 200 equals 10'),
('Year 6', 'Percentages', 'What is 40% of 75?', '30', ARRAY['thirty'], 3, 'Find 10% first', '40% of 75 equals 30'),
('Year 6', 'Percentages', 'What is 25% of 60?', '15', NULL, 2, 'Quarter of 60', '25% of 60 equals 15'),
('Year 6', 'Percentages', 'What is 10% of 90?', '9', ARRAY['nine'], 1, 'Divide by 10', '10% of 90 equals 9'),
('Year 6', 'Percentages', 'What is 50% of 84?', '42', NULL, 1, 'Half of 84', '50% of 84 equals 42'),
('Year 6', 'Percentages', 'What is 75% of 80?', '60', ARRAY['sixty'], 2, 'Three quarters', '75% of 80 equals 60'),
('Year 6', 'Percentages', 'What is 20% of 200?', '40', ARRAY['forty'], 2, 'One fifth', '20% of 200 equals 40'),
('Year 6', 'Percentages', 'What is 35% of 100?', '35', NULL, 2, '35 out of 100', '35% of 100 equals 35'),
('Year 6', 'Percentages', 'What is 80% of 50?', '40', ARRAY['forty'], 2, 'Nearly all', '80% of 50 equals 40'),
('Year 6', 'Percentages', 'What is 90% of 40?', '36', NULL, 3, 'Nearly all of 40', '90% of 40 equals 36'),
('Year 6', 'Percentages', 'What is 12% of 100?', '12', NULL, 2, '12 out of 100', '12% of 100 equals 12'),
('Year 6', 'Percentages', 'What is 45% of 80?', '36', NULL, 3, 'Nearly half', '45% of 80 equals 36');

-- Year 6: Fractions (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Fractions', 'What is 2/3 + 1/6?', '5/6', NULL, 2, 'Convert to sixths', '2/3 plus 1/6 equals 5/6'),
('Year 6', 'Fractions', 'What is 3/4 - 1/3?', '5/12', NULL, 3, 'Find common denominator', '3/4 minus 1/3 equals 5/12'),
('Year 6', 'Fractions', 'What is 1/2 × 3/4?', '3/8', NULL, 3, 'Multiply numerators and denominators', '1/2 times 3/4 equals 3/8'),
('Year 6', 'Fractions', 'What is 2/5 + 3/10?', '7/10', NULL, 2, 'Convert to tenths', '2/5 plus 3/10 equals 7/10'),
('Year 6', 'Fractions', 'What is 5/6 - 1/3?', '1/2', ARRAY['3/6'], 2, 'Convert to sixths', '5/6 minus 1/3 equals 1/2'),
('Year 6', 'Fractions', 'What is 3/5 × 2?', '6/5', ARRAY['1 1/5'], 3, 'Multiply', '3/5 times 2 equals 6/5'),
('Year 6', 'Fractions', 'What is 7/8 - 1/4?', '5/8', NULL, 2, 'Convert to eighths', '7/8 minus 1/4 equals 5/8'),
('Year 6', 'Fractions', 'What is 1/3 + 2/9?', '5/9', NULL, 3, 'Convert to ninths', '1/3 plus 2/9 equals 5/9'),
('Year 6', 'Fractions', 'What is 4/5 - 1/2?', '3/10', NULL, 3, 'Find common denominator', '4/5 minus 1/2 equals 3/10'),
('Year 6', 'Fractions', 'What is 2/3 × 3/4?', '1/2', ARRAY['6/12'], 3, 'Multiply and simplify', '2/3 times 3/4 equals 1/2'),
('Year 6', 'Fractions', 'What is 5/6 of 18?', '15', NULL, 3, 'Find 1/6 first', '5/6 of 18 equals 15'),
('Year 6', 'Fractions', 'What is 3/4 + 1/8?', '7/8', NULL, 2, 'Convert to eighths', '3/4 plus 1/8 equals 7/8'),
('Year 6', 'Fractions', 'What is 11/12 - 2/3?', '1/4', ARRAY['3/12'], 3, 'Convert to twelfths', '11/12 minus 2/3 equals 1/4'),
('Year 6', 'Fractions', 'What is 1/2 ÷ 2?', '1/4', NULL, 3, 'Half of a half', '1/2 divided by 2 equals 1/4'),
('Year 6', 'Fractions', 'What is 3/5 + 1/10?', '7/10', NULL, 2, 'Convert to tenths', '3/5 plus 1/10 equals 7/10');

-- Year 6: Decimals (15 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Decimals', 'What is 3.45 + 2.67?', '6.12', NULL, 2, 'Line up decimals', '3.45 plus 2.67 equals 6.12'),
('Year 6', 'Decimals', 'What is 8.92 - 3.47?', '5.45', NULL, 2, 'Subtract carefully', '8.92 minus 3.47 equals 5.45'),
('Year 6', 'Decimals', 'What is 2.5 × 4?', '10', ARRAY['10.0'], 2, 'Quarter times 4', '2.5 times 4 equals 10'),
('Year 6', 'Decimals', 'What is 12.6 ÷ 3?', '4.2', NULL, 3, 'Divide carefully', '12.6 divided by 3 equals 4.2'),
('Year 6', 'Decimals', 'What is 7.8 + 1.25?', '9.05', NULL, 2, 'Line up decimals', '7.8 plus 1.25 equals 9.05'),
('Year 6', 'Decimals', 'What is 15.4 - 7.6?', '7.8', NULL, 2, 'Subtract', '15.4 minus 7.6 equals 7.8'),
('Year 6', 'Decimals', 'What is 0.5 × 8?', '4', ARRAY['4.0'], 2, 'Half of 8', '0.5 times 8 equals 4'),
('Year 6', 'Decimals', 'What is 6.3 ÷ 9?', '0.7', NULL, 3, 'Divide carefully', '6.3 divided by 9 equals 0.7'),
('Year 6', 'Decimals', 'What is 9.05 + 3.95?', '13', ARRAY['13.0', '13.00'], 2, 'Make 13', '9.05 plus 3.95 equals 13'),
('Year 6', 'Decimals', 'What is 10 - 4.35?', '5.65', NULL, 2, 'Subtract from 10', '10 minus 4.35 equals 5.65'),
('Year 6', 'Decimals', 'What is 1.25 × 8?', '10', ARRAY['10.0'], 3, 'Eighth times 8', '1.25 times 8 equals 10'),
('Year 6', 'Decimals', 'What is 18.6 ÷ 6?', '3.1', NULL, 3, 'Divide', '18.6 divided by 6 equals 3.1'),
('Year 6', 'Decimals', 'What is 4.75 + 3.25?', '8', ARRAY['8.0', '8.00'], 2, 'Make 8', '4.75 plus 3.25 equals 8'),
('Year 6', 'Decimals', 'What is 20 - 12.45?', '7.55', NULL, 3, 'Subtract from 20', '20 minus 12.45 equals 7.55'),
('Year 6', 'Decimals', 'What is 0.75 × 12?', '9', ARRAY['9.0'], 3, 'Three quarters of 12', '0.75 times 12 equals 9');

-- Year 6: Ratio (12 questions)
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Ratio', 'In the ratio 2:3, if the first number is 6, what is the second?', '9', ARRAY['nine'], 2, 'Multiply by 3', 'If 2→6, then 3→9'),
('Year 6', 'Ratio', 'In the ratio 1:4, if the first number is 5, what is the second?', '20', ARRAY['twenty'], 2, 'Multiply by 4', 'If 1→5, then 4→20'),
('Year 6', 'Ratio', 'Simplify the ratio 4:8', '1:2', NULL, 2, 'Divide both by 4', '4:8 simplifies to 1:2'),
('Year 6', 'Ratio', 'In the ratio 3:5, if the second number is 15, what is the first?', '9', ARRAY['nine'], 3, 'Divide 15 by 5 first', 'If 5→15, then 3→9'),
('Year 6', 'Ratio', 'What is the ratio of 10 to 15 in simplest form?', '2:3', NULL, 2, 'Divide both by 5', '10:15 simplifies to 2:3'),
('Year 6', 'Ratio', 'Simplify the ratio 6:9', '2:3', NULL, 2, 'Divide both by 3', '6:9 simplifies to 2:3'),
('Year 6', 'Ratio', 'In the ratio 5:2, if the first number is 10, what is the second?', '4', ARRAY['four'], 2, 'Multiply by 2', 'If 5→10, then 2→4'),
('Year 6', 'Ratio', 'Simplify the ratio 8:12', '2:3', NULL, 2, 'Divide both by 4', '8:12 simplifies to 2:3'),
('Year 6', 'Ratio', 'What is the ratio of 20 to 25 in simplest form?', '4:5', NULL, 2, 'Divide both by 5', '20:25 simplifies to 4:5'),
('Year 6', 'Ratio', 'In the ratio 4:7, if the first number is 12, what is the second?', '21', NULL, 3, 'Scale up', 'If 4→12, then 7→21'),
('Year 6', 'Ratio', 'Simplify the ratio 10:15', '2:3', NULL, 2, 'Divide both by 5', '10:15 simplifies to 2:3'),
('Year 6', 'Ratio', 'In the ratio 2:5, if the total is 14, what is the first part?', '4', ARRAY['four'], 3, '2 out of 7 parts', '2/(2+5) × 14 = 4');

-- ============================================
-- Summary
-- ============================================
-- Year 1: 30 questions (Addition: 15, Subtraction: 15)
-- Year 2: 30 questions (Addition: 15, Multiplication: 15)
-- Year 3: 42 questions (Addition: 12, Multiplication: 15, Division: 15)
-- Year 4: 39 questions (Multiplication: 12, Division: 12, Fractions: 15)
-- Year 5: 42 questions (Multiplication: 12, Fractions: 15, Decimals: 15)
-- Year 6: 62 questions (Percentages: 20, Fractions: 15, Decimals: 15, Ratio: 12)
-- 
-- TOTAL: 245 questions across 6 year groups and multiple subjects
--
-- All questions include:
-- - year_group, subject, question_text, correct_answer
-- - Many include alternative_answers for flexible marking
-- - All have difficulty_level (1=Easy, 2=Medium, 3=Hard)
-- - Most include hint and explanation
-- - All marked as active by default
