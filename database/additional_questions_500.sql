-- Additional 500+ Questions for Gem Hunt Question Bank
-- This file adds questions to expand the existing bank from 245 to 745+ questions
-- Run this after populate_questions.sql

-- ============================================
-- YEAR 1 ADDITIONAL QUESTIONS (70 questions)
-- ============================================

-- Year 1: Number Recognition (15 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 1', 'Numbers', 'What number comes after 7?', '8', ARRAY['eight'], 1, 'Count up', '8 comes after 7'),
('Year 1', 'Numbers', 'What number comes before 5?', '4', ARRAY['four'], 1, 'Count back', '4 comes before 5'),
('Year 1', 'Numbers', 'What number is between 8 and 10?', '9', ARRAY['nine'], 1, 'Think about counting', '9 is between 8 and 10'),
('Year 1', 'Numbers', 'How many fingers on one hand?', '5', ARRAY['five'], 1, 'Look at your hand', 'One hand has 5 fingers'),
('Year 1', 'Numbers', 'What is 1 more than 9?', '10', ARRAY['ten'], 1, 'Count up', '1 more than 9 is 10'),
('Year 1', 'Numbers', 'How many wheels on a bicycle?', '2', ARRAY['two'], 1, 'Think about bikes', 'A bicycle has 2 wheels'),
('Year 1', 'Numbers', 'What number comes after 10?', '11', ARRAY['eleven'], 2, 'Count past 10', '11 comes after 10'),
('Year 1', 'Numbers', 'What is 1 less than 8?', '7', ARRAY['seven'], 1, 'Count back', '1 less than 8 is 7'),
('Year 1', 'Numbers', 'How many sides does a triangle have?', '3', ARRAY['three'], 1, 'Think about triangles', 'A triangle has 3 sides'),
('Year 1', 'Numbers', 'What number is between 4 and 6?', '5', ARRAY['five'], 1, 'Count', '5 is between 4 and 6'),
('Year 1', 'Numbers', 'What is 1 more than 6?', '7', ARRAY['seven'], 1, 'Count up', '1 more than 6 is 7'),
('Year 1', 'Numbers', 'How many legs does a dog have?', '4', ARRAY['four'], 1, 'Think about dogs', 'A dog has 4 legs'),
('Year 1', 'Numbers', 'What number comes before 10?', '9', ARRAY['nine'], 1, 'Count back', '9 comes before 10'),
('Year 1', 'Numbers', 'How many sides does a square have?', '4', ARRAY['four'], 1, 'Think about squares', 'A square has 4 sides'),
('Year 1', 'Numbers', 'What is 2 more than 5?', '7', ARRAY['seven'], 1, 'Count up', '2 more than 5 is 7');

-- Year 1: More Addition (25 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 1', 'Addition', 'What is 1 + 1?', '2', ARRAY['two'], 1, 'Count', '1 plus 1 equals 2'),
('Year 1', 'Addition', 'What is 1 + 2?', '3', ARRAY['three'], 1, 'Count from 1', '1 plus 2 equals 3'),
('Year 1', 'Addition', 'What is 1 + 3?', '4', ARRAY['four'], 1, 'Count up', '1 plus 3 equals 4'),
('Year 1', 'Addition', 'What is 1 + 4?', '5', ARRAY['five'], 1, 'Count from 1', '1 plus 4 equals 5'),
('Year 1', 'Addition', 'What is 1 + 5?', '6', ARRAY['six'], 1, 'Count up', '1 plus 5 equals 6'),
('Year 1', 'Addition', 'What is 2 + 4?', '6', ARRAY['six'], 1, 'Count from 2', '2 plus 4 equals 6'),
('Year 1', 'Addition', 'What is 2 + 5?', '7', ARRAY['seven'], 1, 'Count up', '2 plus 5 equals 7'),
('Year 1', 'Addition', 'What is 2 + 6?', '8', ARRAY['eight'], 1, 'Count from 2', '2 plus 6 equals 8'),
('Year 1', 'Addition', 'What is 3 + 5?', '8', ARRAY['eight'], 1, 'Count up', '3 plus 5 equals 8'),
('Year 1', 'Addition', 'What is 3 + 6?', '9', ARRAY['nine'], 1, 'Count from 3', '3 plus 6 equals 9'),
('Year 1', 'Addition', 'What is 3 + 7?', '10', ARRAY['ten'], 2, 'Make 10', '3 plus 7 equals 10'),
('Year 1', 'Addition', 'What is 4 + 4?', '8', ARRAY['eight'], 1, 'Double 4', '4 plus 4 equals 8'),
('Year 1', 'Addition', 'What is 4 + 6?', '10', ARRAY['ten'], 2, 'Make 10', '4 plus 6 equals 10'),
('Year 1', 'Addition', 'What is 5 + 3?', '8', ARRAY['eight'], 1, 'Count from 5', '5 plus 3 equals 8'),
('Year 1', 'Addition', 'What is 6 + 4?', '10', ARRAY['ten'], 2, 'Make 10', '6 plus 4 equals 10'),
('Year 1', 'Addition', 'What is 1 + 7?', '8', ARRAY['eight'], 1, 'Count up', '1 plus 7 equals 8'),
('Year 1', 'Addition', 'What is 1 + 8?', '9', ARRAY['nine'], 1, 'Count from 1', '1 plus 8 equals 9'),
('Year 1', 'Addition', 'What is 1 + 9?', '10', ARRAY['ten'], 2, 'Make 10', '1 plus 9 equals 10'),
('Year 1', 'Addition', 'What is 2 + 8?', '10', ARRAY['ten'], 2, 'Make 10', '2 plus 8 equals 10'),
('Year 1', 'Addition', 'What is 6 + 1?', '7', ARRAY['seven'], 1, 'Adding 1', '6 plus 1 equals 7'),
('Year 1', 'Addition', 'What is 7 + 1?', '8', ARRAY['eight'], 1, 'Adding 1', '7 plus 1 equals 8'),
('Year 1', 'Addition', 'What is 9 + 1?', '10', ARRAY['ten'], 1, 'Make 10', '9 plus 1 equals 10'),
('Year 1', 'Addition', 'What is 5 + 2?', '7', ARRAY['seven'], 1, 'Count up', '5 plus 2 equals 7'),
('Year 1', 'Addition', 'What is 6 + 3?', '9', ARRAY['nine'], 1, 'Count from 6', '6 plus 3 equals 9'),
('Year 1', 'Addition', 'What is 7 + 2?', '9', ARRAY['nine'], 1, 'Count up', '7 plus 2 equals 9');

-- Year 1: More Subtraction (30 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 1', 'Subtraction', 'What is 3 - 1?', '2', ARRAY['two'], 1, 'Count back', '3 minus 1 equals 2'),
('Year 1', 'Subtraction', 'What is 3 - 2?', '1', ARRAY['one'], 1, 'Count back', '3 minus 2 equals 1'),
('Year 1', 'Subtraction', 'What is 4 - 1?', '3', ARRAY['three'], 1, 'Count back', '4 minus 1 equals 3'),
('Year 1', 'Subtraction', 'What is 4 - 3?', '1', ARRAY['one'], 1, 'Take away 3', '4 minus 3 equals 1'),
('Year 1', 'Subtraction', 'What is 5 - 1?', '4', ARRAY['four'], 1, 'One less', '5 minus 1 equals 4'),
('Year 1', 'Subtraction', 'What is 5 - 3?', '2', ARRAY['two'], 1, 'Count back', '5 minus 3 equals 2'),
('Year 1', 'Subtraction', 'What is 5 - 4?', '1', ARRAY['one'], 1, 'Take away 4', '5 minus 4 equals 1'),
('Year 1', 'Subtraction', 'What is 6 - 1?', '5', ARRAY['five'], 1, 'One less', '6 minus 1 equals 5'),
('Year 1', 'Subtraction', 'What is 6 - 4?', '2', ARRAY['two'], 1, 'Count back', '6 minus 4 equals 2'),
('Year 1', 'Subtraction', 'What is 6 - 5?', '1', ARRAY['one'], 1, 'Take away 5', '6 minus 5 equals 1'),
('Year 1', 'Subtraction', 'What is 7 - 2?', '5', ARRAY['five'], 1, 'Count back', '7 minus 2 equals 5'),
('Year 1', 'Subtraction', 'What is 7 - 3?', '4', ARRAY['four'], 1, 'Take away 3', '7 minus 3 equals 4'),
('Year 1', 'Subtraction', 'What is 7 - 5?', '2', ARRAY['two'], 1, 'Count back', '7 minus 5 equals 2'),
('Year 1', 'Subtraction', 'What is 7 - 6?', '1', ARRAY['one'], 1, 'Take away 6', '7 minus 6 equals 1'),
('Year 1', 'Subtraction', 'What is 8 - 1?', '7', ARRAY['seven'], 1, 'One less', '8 minus 1 equals 7'),
('Year 1', 'Subtraction', 'What is 8 - 2?', '6', ARRAY['six'], 1, 'Count back', '8 minus 2 equals 6'),
('Year 1', 'Subtraction', 'What is 8 - 6?', '2', ARRAY['two'], 1, 'Count back', '8 minus 6 equals 2'),
('Year 1', 'Subtraction', 'What is 8 - 7?', '1', ARRAY['one'], 1, 'Take away 7', '8 minus 7 equals 1'),
('Year 1', 'Subtraction', 'What is 9 - 1?', '8', ARRAY['eight'], 1, 'One less', '9 minus 1 equals 8'),
('Year 1', 'Subtraction', 'What is 9 - 4?', '5', ARRAY['five'], 1, 'Count back', '9 minus 4 equals 5'),
('Year 1', 'Subtraction', 'What is 9 - 6?', '3', ARRAY['three'], 1, 'Count back', '9 minus 6 equals 3'),
('Year 1', 'Subtraction', 'What is 9 - 7?', '2', ARRAY['two'], 1, 'Take away 7', '9 minus 7 equals 2'),
('Year 1', 'Subtraction', 'What is 9 - 8?', '1', ARRAY['one'], 1, 'Take away 8', '9 minus 8 equals 1'),
('Year 1', 'Subtraction', 'What is 10 - 1?', '9', ARRAY['nine'], 1, 'One less than 10', '10 minus 1 equals 9'),
('Year 1', 'Subtraction', 'What is 10 - 2?', '8', ARRAY['eight'], 1, 'Count back', '10 minus 2 equals 8'),
('Year 1', 'Subtraction', 'What is 10 - 6?', '4', ARRAY['four'], 2, 'Count back', '10 minus 6 equals 4'),
('Year 1', 'Subtraction', 'What is 10 - 7?', '3', ARRAY['three'], 2, 'Count back', '10 minus 7 equals 3'),
('Year 1', 'Subtraction', 'What is 10 - 8?', '2', ARRAY['two'], 2, 'Count back', '10 minus 8 equals 2'),
('Year 1', 'Subtraction', 'What is 10 - 9?', '1', ARRAY['one'], 1, 'Take away 9', '10 minus 9 equals 1'),
('Year 1', 'Subtraction', 'What is 10 - 10?', '0', ARRAY['zero'], 1, 'Nothing left', '10 minus 10 equals 0');

-- ============================================
-- YEAR 2 ADDITIONAL QUESTIONS (90 questions)
-- ============================================

-- Year 2: More Subtraction (25 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 2', 'Subtraction', 'What is 20 - 5?', '15', NULL, 1, 'Count back', '20 minus 5 equals 15'),
('Year 2', 'Subtraction', 'What is 30 - 10?', '20', ARRAY['twenty'], 1, 'Take away 10', '30 minus 10 equals 20'),
('Year 2', 'Subtraction', 'What is 25 - 12?', '13', NULL, 2, 'Use column method', '25 minus 12 equals 13'),
('Year 2', 'Subtraction', 'What is 38 - 15?', '23', NULL, 2, 'Subtract carefully', '38 minus 15 equals 23'),
('Year 2', 'Subtraction', 'What is 47 - 23?', '24', NULL, 2, 'Column subtraction', '47 minus 23 equals 24'),
('Year 2', 'Subtraction', 'What is 56 - 34?', '22', NULL, 2, 'Subtract', '56 minus 34 equals 22'),
('Year 2', 'Subtraction', 'What is 40 - 18?', '22', NULL, 2, 'Count back', '40 minus 18 equals 22'),
('Year 2', 'Subtraction', 'What is 50 - 25?', '25', NULL, 1, 'Half of 50', '50 minus 25 equals 25'),
('Year 2', 'Subtraction', 'What is 33 - 11?', '22', NULL, 1, 'Take away 11', '33 minus 11 equals 22'),
('Year 2', 'Subtraction', 'What is 45 - 20?', '25', NULL, 1, 'Subtract 20', '45 minus 20 equals 25'),
('Year 2', 'Subtraction', 'What is 60 - 35?', '25', NULL, 2, 'Count back', '60 minus 35 equals 25'),
('Year 2', 'Subtraction', 'What is 52 - 28?', '24', NULL, 3, 'Column method', '52 minus 28 equals 24'),
('Year 2', 'Subtraction', 'What is 41 - 19?', '22', NULL, 3, 'Nearly 20', '41 minus 19 equals 22'),
('Year 2', 'Subtraction', 'What is 37 - 14?', '23', NULL, 2, 'Subtract', '37 minus 14 equals 23'),
('Year 2', 'Subtraction', 'What is 48 - 26?', '22', NULL, 2, 'Use column method', '48 minus 26 equals 22'),
('Year 2', 'Subtraction', 'What is 39 - 16?', '23', NULL, 2, 'Subtract carefully', '39 minus 16 equals 23'),
('Year 2', 'Subtraction', 'What is 55 - 32?', '23', NULL, 2, 'Column subtraction', '55 minus 32 equals 23'),
('Year 2', 'Subtraction', 'What is 46 - 21?', '25', NULL, 2, 'Subtract', '46 minus 21 equals 25'),
('Year 2', 'Subtraction', 'What is 35 - 13?', '22', NULL, 2, 'Count back', '35 minus 13 equals 22'),
('Year 2', 'Subtraction', 'What is 44 - 22?', '22', NULL, 1, 'Half of 44', '44 minus 22 equals 22'),
('Year 2', 'Subtraction', 'What is 57 - 35?', '22', NULL, 2, 'Subtract', '57 minus 35 equals 22'),
('Year 2', 'Subtraction', 'What is 49 - 24?', '25', NULL, 2, 'Nearly 50', '49 minus 24 equals 25'),
('Year 2', 'Subtraction', 'What is 36 - 12?', '24', NULL, 1, 'Subtract 12', '36 minus 12 equals 24'),
('Year 2', 'Subtraction', 'What is 43 - 18?', '25', NULL, 3, 'Column method', '43 minus 18 equals 25'),
('Year 2', 'Subtraction', 'What is 54 - 29?', '25', NULL, 3, 'Nearly 30', '54 minus 29 equals 25');

-- Year 2: Division (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 2', 'Division', 'What is 4 ÷ 2?', '2', ARRAY['two'], 1, 'Half of 4', '4 divided by 2 equals 2'),
('Year 2', 'Division', 'What is 6 ÷ 2?', '3', ARRAY['three'], 1, 'Half of 6', '6 divided by 2 equals 3'),
('Year 2', 'Division', 'What is 8 ÷ 2?', '4', ARRAY['four'], 1, 'Half of 8', '8 divided by 2 equals 4'),
('Year 2', 'Division', 'What is 10 ÷ 2?', '5', ARRAY['five'], 1, 'Half of 10', '10 divided by 2 equals 5'),
('Year 2', 'Division', 'What is 10 ÷ 5?', '2', ARRAY['two'], 1, 'How many 5s?', '10 divided by 5 equals 2'),
('Year 2', 'Division', 'What is 12 ÷ 2?', '6', ARRAY['six'], 1, 'Half of 12', '12 divided by 2 equals 6'),
('Year 2', 'Division', 'What is 14 ÷ 2?', '7', ARRAY['seven'], 1, 'Half of 14', '14 divided by 2 equals 7'),
('Year 2', 'Division', 'What is 16 ÷ 2?', '8', ARRAY['eight'], 1, 'Half of 16', '16 divided by 2 equals 8'),
('Year 2', 'Division', 'What is 18 ÷ 2?', '9', ARRAY['nine'], 1, 'Half of 18', '18 divided by 2 equals 9'),
('Year 2', 'Division', 'What is 20 ÷ 2?', '10', ARRAY['ten'], 1, 'Half of 20', '20 divided by 2 equals 10'),
('Year 2', 'Division', 'What is 20 ÷ 5?', '4', ARRAY['four'], 1, 'How many 5s?', '20 divided by 5 equals 4'),
('Year 2', 'Division', 'What is 15 ÷ 5?', '3', ARRAY['three'], 1, 'Count in 5s', '15 divided by 5 equals 3'),
('Year 2', 'Division', 'What is 25 ÷ 5?', '5', ARRAY['five'], 2, 'How many 5s?', '25 divided by 5 equals 5'),
('Year 2', 'Division', 'What is 30 ÷ 5?', '6', ARRAY['six'], 2, 'Count in 5s', '30 divided by 5 equals 6'),
('Year 2', 'Division', 'What is 20 ÷ 10?', '2', ARRAY['two'], 1, 'How many 10s?', '20 divided by 10 equals 2'),
('Year 2', 'Division', 'What is 30 ÷ 10?', '3', ARRAY['three'], 1, 'Count in 10s', '30 divided by 10 equals 3'),
('Year 2', 'Division', 'What is 40 ÷ 10?', '4', ARRAY['four'], 1, 'How many 10s?', '40 divided by 10 equals 4'),
('Year 2', 'Division', 'What is 50 ÷ 10?', '5', ARRAY['five'], 1, 'Count in 10s', '50 divided by 10 equals 5'),
('Year 2', 'Division', 'What is 100 ÷ 10?', '10', ARRAY['ten'], 2, 'How many 10s?', '100 divided by 10 equals 10'),
('Year 2', 'Division', 'What is 6 ÷ 3?', '2', ARRAY['two'], 2, 'How many 3s?', '6 divided by 3 equals 2');

-- Year 2: Money (25 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 2', 'Money', 'How many pence in 1 pound?', '100', NULL, 1, '100p = £1', 'There are 100 pence in 1 pound'),
('Year 2', 'Money', 'How many 10p coins make 50p?', '5', ARRAY['five'], 1, 'Count in 10s', '5 ten-pence coins make 50p'),
('Year 2', 'Money', 'How many 5p coins make 20p?', '4', ARRAY['four'], 2, 'Count in 5s', '4 five-pence coins make 20p'),
('Year 2', 'Money', 'How many 2p coins make 10p?', '5', ARRAY['five'], 2, 'Count in 2s', '5 two-pence coins make 10p'),
('Year 2', 'Money', 'What is 20p + 30p?', '50', ARRAY['50p'], 1, 'Add the amounts', '20p plus 30p equals 50p'),
('Year 2', 'Money', 'What is 50p + 50p?', '100', ARRAY['100p', '£1'], 1, 'Makes £1', '50p plus 50p equals 100p or £1'),
('Year 2', 'Money', 'What is 25p + 25p?', '50', ARRAY['50p'], 1, 'Double 25p', '25p plus 25p equals 50p'),
('Year 2', 'Money', 'How many 20p coins make 60p?', '3', ARRAY['three'], 2, 'Count in 20s', '3 twenty-pence coins make 60p'),
('Year 2', 'Money', 'What is 40p + 30p?', '70', ARRAY['70p'], 1, 'Add', '40p plus 30p equals 70p'),
('Year 2', 'Money', 'What is 60p - 20p?', '40', ARRAY['40p'], 1, 'Subtract', '60p minus 20p equals 40p'),
('Year 2', 'Money', 'How many 10p coins make £1?', '10', ARRAY['ten'], 2, 'Count in 10s', '10 ten-pence coins make £1'),
('Year 2', 'Money', 'What is 35p + 15p?', '50', ARRAY['50p'], 2, 'Make 50p', '35p plus 15p equals 50p'),
('Year 2', 'Money', 'What is 45p + 5p?', '50', ARRAY['50p'], 1, 'Make 50p', '45p plus 5p equals 50p'),
('Year 2', 'Money', 'How many 5p coins make 50p?', '10', ARRAY['ten'], 2, 'Count in 5s', '10 five-pence coins make 50p'),
('Year 2', 'Money', 'What is 80p - 30p?', '50', ARRAY['50p'], 1, 'Subtract', '80p minus 30p equals 50p'),
('Year 2', 'Money', 'What is 70p + 20p?', '90', ARRAY['90p'], 1, 'Add', '70p plus 20p equals 90p'),
('Year 2', 'Money', 'What is 55p + 45p?', '100', ARRAY['100p', '£1'], 2, 'Make £1', '55p plus 45p equals 100p'),
('Year 2', 'Money', 'What is 90p - 40p?', '50', ARRAY['50p'], 2, 'Subtract', '90p minus 40p equals 50p'),
('Year 2', 'Money', 'How many 2p coins make 20p?', '10', ARRAY['ten'], 2, 'Count in 2s', '10 two-pence coins make 20p'),
('Year 2', 'Money', 'What is 75p + 25p?', '100', ARRAY['100p', '£1'], 2, 'Make £1', '75p plus 25p equals 100p'),
('Year 2', 'Money', 'What is 65p - 15p?', '50', ARRAY['50p'], 2, 'Subtract', '65p minus 15p equals 50p'),
('Year 2', 'Money', 'What is 30p + 40p?', '70', ARRAY['70p'], 1, 'Add', '30p plus 40p equals 70p'),
('Year 2', 'Money', 'What is 85p - 35p?', '50', ARRAY['50p'], 2, 'Subtract', '85p minus 35p equals 50p'),
('Year 2', 'Money', 'How many 50p coins make £1?', '2', ARRAY['two'], 1, 'Double 50p', '2 fifty-pence coins make £1'),
('Year 2', 'Money', 'What is 48p + 2p?', '50', ARRAY['50p'], 1, 'Make 50p', '48p plus 2p equals 50p');

-- Year 2: Number (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 2', 'Numbers', 'What is 10 more than 25?', '35', NULL, 1, 'Add 10', '10 more than 25 is 35'),
('Year 2', 'Numbers', 'What is 10 less than 40?', '30', ARRAY['thirty'], 1, 'Subtract 10', '10 less than 40 is 30'),
('Year 2', 'Numbers', 'What number comes after 49?', '50', ARRAY['fifty'], 1, 'Count up', '50 comes after 49'),
('Year 2', 'Numbers', 'What number comes before 30?', '29', NULL, 1, 'Count back', '29 comes before 30'),
('Year 2', 'Numbers', 'What is double 15?', '30', ARRAY['thirty'], 2, 'Multiply by 2', 'Double 15 is 30'),
('Year 2', 'Numbers', 'What is double 20?', '40', ARRAY['forty'], 1, 'Multiply by 2', 'Double 20 is 40'),
('Year 2', 'Numbers', 'What is half of 30?', '15', NULL, 2, 'Divide by 2', 'Half of 30 is 15'),
('Year 2', 'Numbers', 'What is half of 40?', '20', ARRAY['twenty'], 1, 'Divide by 2', 'Half of 40 is 20'),
('Year 2', 'Numbers', 'What is 20 more than 30?', '50', ARRAY['fifty'], 1, 'Add 20', '20 more than 30 is 50'),
('Year 2', 'Numbers', 'What is 20 less than 50?', '30', ARRAY['thirty'], 1, 'Subtract 20', '20 less than 50 is 30'),
('Year 2', 'Numbers', 'What number is between 38 and 40?', '39', NULL, 1, 'Count', '39 is between 38 and 40'),
('Year 2', 'Numbers', 'What is double 12?', '24', NULL, 2, 'Multiply by 2', 'Double 12 is 24'),
('Year 2', 'Numbers', 'What is double 25?', '50', ARRAY['fifty'], 2, 'Multiply by 2', 'Double 25 is 50'),
('Year 2', 'Numbers', 'What is half of 50?', '25', NULL, 2, 'Divide by 2', 'Half of 50 is 25'),
('Year 2', 'Numbers', 'What is half of 60?', '30', ARRAY['thirty'], 2, 'Divide by 2', 'Half of 60 is 30'),
('Year 2', 'Numbers', 'What is 5 more than 45?', '50', ARRAY['fifty'], 1, 'Add 5', '5 more than 45 is 50'),
('Year 2', 'Numbers', 'What is 5 less than 35?', '30', ARRAY['thirty'], 1, 'Subtract 5', '5 less than 35 is 30'),
('Year 2', 'Numbers', 'What number comes after 59?', '60', ARRAY['sixty'], 1, 'Count up', '60 comes after 59'),
('Year 2', 'Numbers', 'What number comes before 50?', '49', NULL, 1, 'Count back', '49 comes before 50'),
('Year 2', 'Numbers', 'What is double 30?', '60', ARRAY['sixty'], 1, 'Multiply by 2', 'Double 30 is 60');

-- ============================================
-- YEAR 3 ADDITIONAL QUESTIONS (85 questions)
-- ============================================

-- Year 3: More Subtraction (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 3', 'Subtraction', 'What is 100 - 45?', '55', NULL, 2, 'Count back', '100 minus 45 equals 55'),
('Year 3', 'Subtraction', 'What is 200 - 125?', '75', NULL, 2, 'Column method', '200 minus 125 equals 75'),
('Year 3', 'Subtraction', 'What is 150 - 75?', '75', NULL, 2, 'Half of 150', '150 minus 75 equals 75'),
('Year 3', 'Subtraction', 'What is 250 - 130?', '120', NULL, 2, 'Subtract', '250 minus 130 equals 120'),
('Year 3', 'Subtraction', 'What is 180 - 90?', '90', ARRAY['ninety'], 2, 'Half of 180', '180 minus 90 equals 90'),
('Year 3', 'Subtraction', 'What is 300 - 145?', '155', NULL, 2, 'Column method', '300 minus 145 equals 155'),
('Year 3', 'Subtraction', 'What is 425 - 225?', '200', NULL, 2, 'Subtract hundreds', '425 minus 225 equals 200'),
('Year 3', 'Subtraction', 'What is 368 - 168?', '200', NULL, 2, 'Same pattern', '368 minus 168 equals 200'),
('Year 3', 'Subtraction', 'What is 275 - 125?', '150', NULL, 2, 'Subtract', '275 minus 125 equals 150'),
('Year 3', 'Subtraction', 'What is 400 - 235?', '165', NULL, 3, 'Column method', '400 minus 235 equals 165'),
('Year 3', 'Subtraction', 'What is 320 - 145?', '175', NULL, 3, 'Subtract carefully', '320 minus 145 equals 175'),
('Year 3', 'Subtraction', 'What is 285 - 135?', '150', NULL, 2, 'Subtract', '285 minus 135 equals 150'),
('Year 3', 'Subtraction', 'What is 500 - 275?', '225', NULL, 3, 'Column method', '500 minus 275 equals 225'),
('Year 3', 'Subtraction', 'What is 395 - 195?', '200', NULL, 2, 'Same pattern', '395 minus 195 equals 200'),
('Year 3', 'Subtraction', 'What is 450 - 250?', '200', NULL, 2, 'Subtract hundreds', '450 minus 250 equals 200'),
('Year 3', 'Subtraction', 'What is 375 - 175?', '200', NULL, 2, 'Subtract', '375 minus 175 equals 200'),
('Year 3', 'Subtraction', 'What is 288 - 138?', '150', NULL, 2, 'Column method', '288 minus 138 equals 150'),
('Year 3', 'Subtraction', 'What is 333 - 133?', '200', NULL, 2, 'Pattern', '333 minus 133 equals 200'),
('Year 3', 'Subtraction', 'What is 480 - 230?', '250', NULL, 2, 'Subtract', '480 minus 230 equals 250'),
('Year 3', 'Subtraction', 'What is 565 - 265?', '300', NULL, 2, 'Subtract hundreds', '565 minus 265 equals 300');

-- Year 3: More Fractions (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 3', 'Fractions', 'What is half of 20?', '10', ARRAY['ten'], 1, 'Divide by 2', 'Half of 20 is 10'),
('Year 3', 'Fractions', 'What is 1/2 of 14?', '7', ARRAY['seven'], 1, 'Divide by 2', '1/2 of 14 is 7'),
('Year 3', 'Fractions', 'What is 1/2 of 18?', '9', ARRAY['nine'], 1, 'Divide by 2', '1/2 of 18 is 9'),
('Year 3', 'Fractions', 'What is 1/4 of 12?', '3', ARRAY['three'], 2, 'Divide by 4', '1/4 of 12 is 3'),
('Year 3', 'Fractions', 'What is 1/4 of 16?', '4', ARRAY['four'], 2, 'Divide by 4', '1/4 of 16 is 4'),
('Year 3', 'Fractions', 'What is 1/4 of 24?', '6', ARRAY['six'], 2, 'Divide by 4', '1/4 of 24 is 6'),
('Year 3', 'Fractions', 'What is 1/3 of 9?', '3', ARRAY['three'], 2, 'Divide by 3', '1/3 of 9 is 3'),
('Year 3', 'Fractions', 'What is 1/3 of 15?', '5', ARRAY['five'], 2, 'Divide by 3', '1/3 of 15 is 5'),
('Year 3', 'Fractions', 'What is 1/3 of 18?', '6', ARRAY['six'], 2, 'Divide by 3', '1/3 of 18 is 6'),
('Year 3', 'Fractions', 'What is 3/4 of 8?', '6', ARRAY['six'], 3, 'Find 1/4 first', '3/4 of 8 is 6'),
('Year 3', 'Fractions', 'What is 3/4 of 12?', '9', ARRAY['nine'], 3, 'Find 1/4 first', '3/4 of 12 is 9'),
('Year 3', 'Fractions', 'What is 2/3 of 9?', '6', ARRAY['six'], 3, 'Find 1/3 first', '2/3 of 9 is 6'),
('Year 3', 'Fractions', 'What is 2/3 of 15?', '10', ARRAY['ten'], 3, 'Find 1/3 first', '2/3 of 15 is 10'),
('Year 3', 'Fractions', 'What is 1/5 of 10?', '2', ARRAY['two'], 2, 'Divide by 5', '1/5 of 10 is 2'),
('Year 3', 'Fractions', 'What is 1/5 of 20?', '4', ARRAY['four'], 2, 'Divide by 5', '1/5 of 20 is 4'),
('Year 3', 'Fractions', 'What is 1/5 of 25?', '5', ARRAY['five'], 2, 'Divide by 5', '1/5 of 25 is 5'),
('Year 3', 'Fractions', 'What is 2/5 of 10?', '4', ARRAY['four'], 3, 'Find 1/5 first', '2/5 of 10 is 4'),
('Year 3', 'Fractions', 'What is 2/5 of 20?', '8', ARRAY['eight'], 3, 'Find 1/5 first', '2/5 of 20 is 8'),
('Year 3', 'Fractions', 'What is 3/5 of 10?', '6', ARRAY['six'], 3, 'Find 1/5 first', '3/5 of 10 is 6'),
('Year 3', 'Fractions', 'What is 4/5 of 10?', '8', ARRAY['eight'], 3, 'Find 1/5 first', '4/5 of 10 is 8');

-- Year 3: Money (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 3', 'Money', 'What is £2 + £3?', '5', ARRAY['£5', 'five'], 1, 'Add the pounds', '£2 plus £3 equals £5'),
('Year 3', 'Money', 'What is £5 - £2?', '3', ARRAY['£3', 'three'], 1, 'Subtract', '£5 minus £2 equals £3'),
('Year 3', 'Money', 'What is £1.50 + £2.50?', '4', ARRAY['£4', 'four'], 2, 'Make £4', '£1.50 plus £2.50 equals £4'),
('Year 3', 'Money', 'What is £3.25 + £1.75?', '5', ARRAY['£5', 'five'], 2, 'Make £5', '£3.25 plus £1.75 equals £5'),
('Year 3', 'Money', 'What is £4.50 + £2.50?', '7', ARRAY['£7', 'seven'], 2, 'Add carefully', '£4.50 plus £2.50 equals £7'),
('Year 3', 'Money', 'What is £5.75 - £2.25?', '3.50', ARRAY['£3.50', '3.5'], 2, 'Subtract', '£5.75 minus £2.25 equals £3.50'),
('Year 3', 'Money', 'What is £6 - £2.50?', '3.50', ARRAY['£3.50', '3.5'], 2, 'Subtract', '£6 minus £2.50 equals £3.50'),
('Year 3', 'Money', 'What is £2.20 + £1.80?', '4', ARRAY['£4', 'four'], 2, 'Make £4', '£2.20 plus £1.80 equals £4'),
('Year 3', 'Money', 'What is £3.60 + £1.40?', '5', ARRAY['£5', 'five'], 2, 'Make £5', '£3.60 plus £1.40 equals £5'),
('Year 3', 'Money', 'What is £7 - £3?', '4', ARRAY['£4', 'four'], 1, 'Subtract', '£7 minus £3 equals £4'),
('Year 3', 'Money', 'What is £8.50 - £3.50?', '5', ARRAY['£5', 'five'], 2, 'Subtract', '£8.50 minus £3.50 equals £5'),
('Year 3', 'Money', 'What is £4.75 + £3.25?', '8', ARRAY['£8', 'eight'], 2, 'Make £8', '£4.75 plus £3.25 equals £8'),
('Year 3', 'Money', 'What is £10 - £4.50?', '5.50', ARRAY['£5.50', '5.5'], 2, 'Subtract', '£10 minus £4.50 equals £5.50'),
('Year 3', 'Money', 'What is £2.65 + £2.35?', '5', ARRAY['£5', 'five'], 2, 'Make £5', '£2.65 plus £2.35 equals £5'),
('Year 3', 'Money', 'What is £6.80 - £2.80?', '4', ARRAY['£4', 'four'], 2, 'Subtract', '£6.80 minus £2.80 equals £4'),
('Year 3', 'Money', 'What is £5.25 + £4.75?', '10', ARRAY['£10', 'ten'], 2, 'Make £10', '£5.25 plus £4.75 equals £10'),
('Year 3', 'Money', 'What is £9 - £3.50?', '5.50', ARRAY['£5.50', '5.5'], 2, 'Subtract', '£9 minus £3.50 equals £5.50'),
('Year 3', 'Money', 'What is £3.85 + £1.15?', '5', ARRAY['£5', 'five'], 2, 'Make £5', '£3.85 plus £1.15 equals £5'),
('Year 3', 'Money', 'What is £7.50 - £2.50?', '5', ARRAY['£5', 'five'], 2, 'Subtract', '£7.50 minus £2.50 equals £5'),
('Year 3', 'Money', 'What is £4.40 + £3.60?', '8', ARRAY['£8', 'eight'], 2, 'Make £8', '£4.40 plus £3.60 equals £8');

-- Year 3: Time (25 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 3', 'Time', 'How many minutes in 1 hour?', '60', ARRAY['sixty'], 1, '60 minutes', 'There are 60 minutes in 1 hour'),
('Year 3', 'Time', 'How many seconds in 1 minute?', '60', ARRAY['sixty'], 1, '60 seconds', 'There are 60 seconds in 1 minute'),
('Year 3', 'Time', 'How many hours in 1 day?', '24', NULL, 1, '24 hours', 'There are 24 hours in 1 day'),
('Year 3', 'Time', 'How many minutes in half an hour?', '30', ARRAY['thirty'], 1, 'Half of 60', 'There are 30 minutes in half an hour'),
('Year 3', 'Time', 'How many minutes in a quarter of an hour?', '15', NULL, 2, 'Quarter of 60', 'There are 15 minutes in a quarter of an hour'),
('Year 3', 'Time', 'How many days in 1 week?', '7', ARRAY['seven'], 1, '7 days', 'There are 7 days in 1 week'),
('Year 3', 'Time', 'How many days in 2 weeks?', '14', NULL, 2, 'Double 7', 'There are 14 days in 2 weeks'),
('Year 3', 'Time', 'How many hours in half a day?', '12', NULL, 2, 'Half of 24', 'There are 12 hours in half a day'),
('Year 3', 'Time', 'What is 30 minutes + 30 minutes?', '60', ARRAY['sixty', '1 hour'], 1, 'Make an hour', '30 minutes plus 30 minutes equals 60 minutes or 1 hour'),
('Year 3', 'Time', 'What is 15 minutes + 45 minutes?', '60', ARRAY['sixty', '1 hour'], 2, 'Make an hour', '15 minutes plus 45 minutes equals 60 minutes'),
('Year 3', 'Time', 'What is 20 minutes + 40 minutes?', '60', ARRAY['sixty', '1 hour'], 2, 'Make an hour', '20 minutes plus 40 minutes equals 60 minutes'),
('Year 3', 'Time', 'How many minutes in 2 hours?', '120', NULL, 2, 'Double 60', 'There are 120 minutes in 2 hours'),
('Year 3', 'Time', 'What is 1 hour - 15 minutes?', '45', NULL, 2, 'Subtract from 60', '1 hour minus 15 minutes equals 45 minutes'),
('Year 3', 'Time', 'What is 1 hour - 20 minutes?', '40', ARRAY['forty'], 2, 'Subtract from 60', '1 hour minus 20 minutes equals 40 minutes'),
('Year 3', 'Time', 'What is 1 hour - 30 minutes?', '30', ARRAY['thirty'], 2, 'Half an hour', '1 hour minus 30 minutes equals 30 minutes'),
('Year 3', 'Time', 'How many weeks in 21 days?', '3', ARRAY['three'], 2, 'Divide by 7', 'There are 3 weeks in 21 days'),
('Year 3', 'Time', 'How many weeks in 28 days?', '4', ARRAY['four'], 2, 'Divide by 7', 'There are 4 weeks in 28 days'),
('Year 3', 'Time', 'What is 90 minutes in hours?', '1.5', ARRAY['1 hour 30 minutes', '1½'], 3, '1 and a half', '90 minutes equals 1.5 hours'),
('Year 3', 'Time', 'What is 45 minutes + 15 minutes?', '60', ARRAY['sixty', '1 hour'], 2, 'Make an hour', '45 minutes plus 15 minutes equals 60 minutes'),
('Year 3', 'Time', 'What is 50 minutes + 10 minutes?', '60', ARRAY['sixty', '1 hour'], 1, 'Make an hour', '50 minutes plus 10 minutes equals 60 minutes'),
('Year 3', 'Time', 'How many hours in 3 days?', '72', NULL, 3, '24 × 3', 'There are 72 hours in 3 days'),
('Year 3', 'Time', 'What is 2 hours in minutes?', '120', NULL, 2, 'Double 60', '2 hours equals 120 minutes'),
('Year 3', 'Time', 'What is 3 hours in minutes?', '180', NULL, 3, '3 × 60', '3 hours equals 180 minutes'),
('Year 3', 'Time', 'What is 1 hour + 30 minutes in minutes?', '90', ARRAY['ninety'], 2, 'Add to 60', '1 hour 30 minutes equals 90 minutes'),
('Year 3', 'Time', 'What is 2 hours + 30 minutes in minutes?', '150', NULL, 3, 'Add to 120', '2 hours 30 minutes equals 150 minutes');

-- ============================================
-- YEAR 4 ADDITIONAL QUESTIONS (90 questions)
-- ============================================

-- Year 4: More Addition (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 4', 'Addition', 'What is 1234 + 2345?', '3579', NULL, 3, 'Column addition', '1234 plus 2345 equals 3579'),
('Year 4', 'Addition', 'What is 2567 + 1234?', '3801', NULL, 3, 'Add carefully', '2567 plus 1234 equals 3801'),
('Year 4', 'Addition', 'What is 3456 + 2345?', '5801', NULL, 3, 'Column method', '3456 plus 2345 equals 5801'),
('Year 4', 'Addition', 'What is 4567 + 1234?', '5801', NULL, 3, 'Add', '4567 plus 1234 equals 5801'),
('Year 4', 'Addition', 'What is 1500 + 2500?', '4000', NULL, 2, 'Add thousands', '1500 plus 2500 equals 4000'),
('Year 4', 'Addition', 'What is 2750 + 1250?', '4000', NULL, 2, 'Make 4000', '2750 plus 1250 equals 4000'),
('Year 4', 'Addition', 'What is 3250 + 1750?', '5000', NULL, 2, 'Make 5000', '3250 plus 1750 equals 5000'),
('Year 4', 'Addition', 'What is 4125 + 2875?', '7000', NULL, 3, 'Add carefully', '4125 plus 2875 equals 7000'),
('Year 4', 'Addition', 'What is 3678 + 4321?', '7999', NULL, 3, 'Nearly 8000', '3678 plus 4321 equals 7999'),
('Year 4', 'Addition', 'What is 5432 + 2567?', '7999', NULL, 3, 'Add', '5432 plus 2567 equals 7999'),
('Year 4', 'Addition', 'What is 2468 + 1357?', '3825', NULL, 3, 'Column method', '2468 plus 1357 equals 3825'),
('Year 4', 'Addition', 'What is 3579 + 2468?', '6047', NULL, 3, 'Add carefully', '3579 plus 2468 equals 6047'),
('Year 4', 'Addition', 'What is 4680 + 1357?', '6037', NULL, 3, 'Column addition', '4680 plus 1357 equals 6037'),
('Year 4', 'Addition', 'What is 5791 + 2468?', '8259', NULL, 3, 'Add', '5791 plus 2468 equals 8259'),
('Year 4', 'Addition', 'What is 1999 + 1999?', '3998', NULL, 3, 'Nearly 4000', '1999 plus 1999 equals 3998'),
('Year 4', 'Addition', 'What is 2999 + 1999?', '4998', NULL, 3, 'Nearly 5000', '2999 plus 1999 equals 4998'),
('Year 4', 'Addition', 'What is 3999 + 2999?', '6998', NULL, 3, 'Nearly 7000', '3999 plus 2999 equals 6998'),
('Year 4', 'Addition', 'What is 4999 + 1999?', '6998', NULL, 3, 'Add', '4999 plus 1999 equals 6998'),
('Year 4', 'Addition', 'What is 5555 + 2222?', '7777', NULL, 3, 'Pattern', '5555 plus 2222 equals 7777'),
('Year 4', 'Addition', 'What is 6666 + 1111?', '7777', NULL, 3, 'Pattern', '6666 plus 1111 equals 7777');

-- Year 4: More Subtraction (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 4', 'Subtraction', 'What is 5000 - 2000?', '3000', NULL, 2, 'Subtract thousands', '5000 minus 2000 equals 3000'),
('Year 4', 'Subtraction', 'What is 6000 - 2500?', '3500', NULL, 2, 'Subtract', '6000 minus 2500 equals 3500'),
('Year 4', 'Subtraction', 'What is 7000 - 3250?', '3750', NULL, 3, 'Column method', '7000 minus 3250 equals 3750'),
('Year 4', 'Subtraction', 'What is 8000 - 3456?', '4544', NULL, 3, 'Subtract carefully', '8000 minus 3456 equals 4544'),
('Year 4', 'Subtraction', 'What is 4567 - 2234?', '2333', NULL, 3, 'Column subtraction', '4567 minus 2234 equals 2333'),
('Year 4', 'Subtraction', 'What is 5678 - 2345?', '3333', NULL, 3, 'Subtract', '5678 minus 2345 equals 3333'),
('Year 4', 'Subtraction', 'What is 6789 - 3456?', '3333', NULL, 3, 'Column method', '6789 minus 3456 equals 3333'),
('Year 4', 'Subtraction', 'What is 3456 - 1234?', '2222', NULL, 3, 'Subtract', '3456 minus 1234 equals 2222'),
('Year 4', 'Subtraction', 'What is 4321 - 2109?', '2212', NULL, 3, 'Column subtraction', '4321 minus 2109 equals 2212'),
('Year 4', 'Subtraction', 'What is 5432 - 3210?', '2222', NULL, 3, 'Subtract', '5432 minus 3210 equals 2222'),
('Year 4', 'Subtraction', 'What is 9000 - 4500?', '4500', NULL, 2, 'Half of 9000', '9000 minus 4500 equals 4500'),
('Year 4', 'Subtraction', 'What is 7500 - 3750?', '3750', NULL, 3, 'Half of 7500', '7500 minus 3750 equals 3750'),
('Year 4', 'Subtraction', 'What is 8888 - 4444?', '4444', NULL, 3, 'Half', '8888 minus 4444 equals 4444'),
('Year 4', 'Subtraction', 'What is 6666 - 3333?', '3333', NULL, 3, 'Half', '6666 minus 3333 equals 3333'),
('Year 4', 'Subtraction', 'What is 5555 - 2222?', '3333', NULL, 3, 'Subtract', '5555 minus 2222 equals 3333'),
('Year 4', 'Subtraction', 'What is 7777 - 3333?', '4444', NULL, 3, 'Subtract', '7777 minus 3333 equals 4444'),
('Year 4', 'Subtraction', 'What is 9999 - 4999?', '5000', NULL, 3, 'Nearly 5000', '9999 minus 4999 equals 5000'),
('Year 4', 'Subtraction', 'What is 8765 - 4321?', '4444', NULL, 3, 'Column method', '8765 minus 4321 equals 4444'),
('Year 4', 'Subtraction', 'What is 7654 - 3210?', '4444', NULL, 3, 'Subtract', '7654 minus 3210 equals 4444'),
('Year 4', 'Subtraction', 'What is 6543 - 2109?', '4434', NULL, 3, 'Column subtraction', '6543 minus 2109 equals 4434');

-- Year 4: Decimals (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 4', 'Decimals', 'What is 1.5 + 2.5?', '4', ARRAY['4.0'], 2, 'Add', '1.5 plus 2.5 equals 4'),
('Year 4', 'Decimals', 'What is 3.2 + 1.8?', '5', ARRAY['5.0'], 2, 'Make 5', '3.2 plus 1.8 equals 5'),
('Year 4', 'Decimals', 'What is 4.7 + 2.3?', '7', ARRAY['7.0'], 2, 'Make 7', '4.7 plus 2.3 equals 7'),
('Year 4', 'Decimals', 'What is 5.5 + 1.5?', '7', ARRAY['7.0'], 2, 'Add', '5.5 plus 1.5 equals 7'),
('Year 4', 'Decimals', 'What is 2.6 + 3.4?', '6', ARRAY['6.0'], 2, 'Make 6', '2.6 plus 3.4 equals 6'),
('Year 4', 'Decimals', 'What is 6.5 - 2.5?', '4', ARRAY['4.0'], 2, 'Subtract', '6.5 minus 2.5 equals 4'),
('Year 4', 'Decimals', 'What is 7.8 - 3.8?', '4', ARRAY['4.0'], 2, 'Subtract', '7.8 minus 3.8 equals 4'),
('Year 4', 'Decimals', 'What is 8.9 - 4.9?', '4', ARRAY['4.0'], 2, 'Subtract', '8.9 minus 4.9 equals 4'),
('Year 4', 'Decimals', 'What is 5.7 - 1.7?', '4', ARRAY['4.0'], 2, 'Subtract', '5.7 minus 1.7 equals 4'),
('Year 4', 'Decimals', 'What is 9.3 - 5.3?', '4', ARRAY['4.0'], 2, 'Subtract', '9.3 minus 5.3 equals 4'),
('Year 4', 'Decimals', 'What is 2.5 × 2?', '5', ARRAY['5.0'], 2, 'Double', '2.5 times 2 equals 5'),
('Year 4', 'Decimals', 'What is 1.5 × 4?', '6', ARRAY['6.0'], 2, 'Multiply', '1.5 times 4 equals 6'),
('Year 4', 'Decimals', 'What is 3.5 × 2?', '7', ARRAY['7.0'], 2, 'Double', '3.5 times 2 equals 7'),
('Year 4', 'Decimals', 'What is 4.5 × 2?', '9', ARRAY['9.0'], 2, 'Double', '4.5 times 2 equals 9'),
('Year 4', 'Decimals', 'What is 1.2 × 5?', '6', ARRAY['6.0'], 3, 'Multiply', '1.2 times 5 equals 6'),
('Year 4', 'Decimals', 'What is 0.5 × 10?', '5', ARRAY['5.0'], 2, 'Multiply by 10', '0.5 times 10 equals 5'),
('Year 4', 'Decimals', 'What is 0.7 × 10?', '7', ARRAY['7.0'], 2, 'Multiply by 10', '0.7 times 10 equals 7'),
('Year 4', 'Decimals', 'What is 1.3 × 3?', '3.9', NULL, 3, 'Multiply', '1.3 times 3 equals 3.9'),
('Year 4', 'Decimals', 'What is 2.2 × 2?', '4.4', NULL, 2, 'Double', '2.2 times 2 equals 4.4'),
('Year 4', 'Decimals', 'What is 3.3 × 2?', '6.6', NULL, 2, 'Double', '3.3 times 2 equals 6.6');

-- Year 4: Area and Perimeter (15 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 4', 'Area', 'What is the area of a rectangle 5cm by 4cm?', '20', NULL, 2, 'Length × width', 'Area = 5 × 4 = 20 square cm'),
('Year 4', 'Area', 'What is the area of a rectangle 6cm by 3cm?', '18', NULL, 2, 'Length × width', 'Area = 6 × 3 = 18 square cm'),
('Year 4', 'Area', 'What is the area of a rectangle 7cm by 2cm?', '14', NULL, 2, 'Length × width', 'Area = 7 × 2 = 14 square cm'),
('Year 4', 'Area', 'What is the area of a rectangle 8cm by 5cm?', '40', ARRAY['forty'], 2, 'Length × width', 'Area = 8 × 5 = 40 square cm'),
('Year 4', 'Area', 'What is the area of a square with sides 4cm?', '16', NULL, 2, 'Side × side', 'Area = 4 × 4 = 16 square cm'),
('Year 4', 'Area', 'What is the area of a square with sides 5cm?', '25', NULL, 2, 'Side × side', 'Area = 5 × 5 = 25 square cm'),
('Year 4', 'Area', 'What is the area of a square with sides 6cm?', '36', NULL, 2, 'Side × side', 'Area = 6 × 6 = 36 square cm'),
('Year 4', 'Perimeter', 'What is the perimeter of a rectangle 5cm by 3cm?', '16', NULL, 2, 'Add all sides', 'Perimeter = 5+3+5+3 = 16cm'),
('Year 4', 'Perimeter', 'What is the perimeter of a rectangle 6cm by 4cm?', '20', ARRAY['twenty'], 2, 'Add all sides', 'Perimeter = 6+4+6+4 = 20cm'),
('Year 4', 'Perimeter', 'What is the perimeter of a rectangle 7cm by 3cm?', '20', ARRAY['twenty'], 2, 'Add all sides', 'Perimeter = 7+3+7+3 = 20cm'),
('Year 4', 'Perimeter', 'What is the perimeter of a square with sides 5cm?', '20', ARRAY['twenty'], 2, '4 × side', 'Perimeter = 4 × 5 = 20cm'),
('Year 4', 'Perimeter', 'What is the perimeter of a square with sides 6cm?', '24', NULL, 2, '4 × side', 'Perimeter = 4 × 6 = 24cm'),
('Year 4', 'Perimeter', 'What is the perimeter of a square with sides 8cm?', '32', NULL, 2, '4 × side', 'Perimeter = 4 × 8 = 32cm'),
('Year 4', 'Perimeter', 'What is the perimeter of a rectangle 8cm by 2cm?', '20', ARRAY['twenty'], 2, 'Add all sides', 'Perimeter = 8+2+8+2 = 20cm'),
('Year 4', 'Perimeter', 'What is the perimeter of a rectangle 9cm by 1cm?', '20', ARRAY['twenty'], 2, 'Add all sides', 'Perimeter = 9+1+9+1 = 20cm');

-- Year 4: Word Problems (15 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 4', 'Word Problems', 'If a book costs £3 and you buy 4, how much in total?', '12', ARRAY['£12'], 2, 'Multiply', '£3 × 4 = £12'),
('Year 4', 'Word Problems', 'If you have £20 and spend £12, how much is left?', '8', ARRAY['£8'], 2, 'Subtract', '£20 - £12 = £8'),
('Year 4', 'Word Problems', 'A bus has 45 seats. If 28 are taken, how many are empty?', '17', NULL, 2, 'Subtract', '45 - 28 = 17 seats'),
('Year 4', 'Word Problems', 'If 6 pencils cost 30p, how much does each pencil cost?', '5', ARRAY['5p'], 3, 'Divide', '30p ÷ 6 = 5p'),
('Year 4', 'Word Problems', 'A rope is 50m long. If you cut off 18m, how much is left?', '32', NULL, 2, 'Subtract', '50m - 18m = 32m'),
('Year 4', 'Word Problems', 'If 8 oranges cost £4, how much does each orange cost?', '0.50', ARRAY['50p', '0.5'], 3, 'Divide', '£4 ÷ 8 = £0.50'),
('Year 4', 'Word Problems', 'A train journey takes 2 hours 45 minutes. How many minutes is this?', '165', NULL, 3, '2 hours = 120 min', '120 + 45 = 165 minutes'),
('Year 4', 'Word Problems', 'If you save £5 each week for 8 weeks, how much in total?', '40', ARRAY['£40'], 2, 'Multiply', '£5 × 8 = £40'),
('Year 4', 'Word Problems', 'A chocolate bar has 12 pieces. If you eat 1/4, how many pieces?', '3', ARRAY['three'], 3, 'Find 1/4 of 12', '12 ÷ 4 = 3 pieces'),
('Year 4', 'Word Problems', 'If a car travels 60 miles in 1 hour, how far in 3 hours?', '180', NULL, 3, 'Multiply', '60 × 3 = 180 miles'),
('Year 4', 'Word Problems', 'There are 35 children. If 5 sit at each table, how many tables?', '7', ARRAY['seven'], 2, 'Divide', '35 ÷ 5 = 7 tables'),
('Year 4', 'Word Problems', 'If a film is 90 minutes long, how many hours and minutes?', '1.5', ARRAY['1 hour 30 minutes', '1½'], 3, '1.5 hours', '90 minutes = 1 hour 30 minutes'),
('Year 4', 'Word Problems', 'A box holds 24 eggs. How many eggs in 3 boxes?', '72', NULL, 2, 'Multiply', '24 × 3 = 72 eggs'),
('Year 4', 'Word Problems', 'If you have 100 stickers and give 1/4 away, how many left?', '75', NULL, 3, 'Find 3/4', '100 - 25 = 75 stickers'),
('Year 4', 'Word Problems', 'A recipe needs 250g flour. How much for 4 batches?', '1000', NULL, 3, 'Multiply', '250g × 4 = 1000g or 1kg');

-- ============================================
-- YEAR 5 ADDITIONAL QUESTIONS (85 questions)
-- ============================================

-- Year 5: More Division (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 5', 'Division', 'What is 144 ÷ 12?', '12', NULL, 2, '12 times 12', '144 divided by 12 equals 12'),
('Year 5', 'Division', 'What is 180 ÷ 12?', '15', NULL, 3, 'Use your tables', '180 divided by 12 equals 15'),
('Year 5', 'Division', 'What is 156 ÷ 12?', '13', NULL, 3, 'Use multiplication', '156 divided by 12 equals 13'),
('Year 5', 'Division', 'What is 132 ÷ 11?', '12', NULL, 3, 'Use your tables', '132 divided by 11 equals 12'),
('Year 5', 'Division', 'What is 165 ÷ 15?', '11', NULL, 3, 'Think of 15 times', '165 divided by 15 equals 11'),
('Year 5', 'Division', 'What is 216 ÷ 18?', '12', NULL, 3, 'Use division', '216 divided by 18 equals 12'),
('Year 5', 'Division', 'What is 240 ÷ 16?', '15', NULL, 3, 'Think carefully', '240 divided by 16 equals 15'),
('Year 5', 'Division', 'What is 270 ÷ 18?', '15', NULL, 3, 'Use your tables', '270 divided by 18 equals 15'),
('Year 5', 'Division', 'What is 300 ÷ 15?', '20', ARRAY['twenty'], 3, 'Think of 15 times', '300 divided by 15 equals 20'),
('Year 5', 'Division', 'What is 336 ÷ 21?', '16', NULL, 3, 'Use division', '336 divided by 21 equals 16'),
('Year 5', 'Division', 'What is 168 ÷ 14?', '12', NULL, 3, 'Use your tables', '168 divided by 14 equals 12'),
('Year 5', 'Division', 'What is 210 ÷ 14?', '15', NULL, 3, 'Think of 14 times', '210 divided by 14 equals 15'),
('Year 5', 'Division', 'What is 192 ÷ 16?', '12', NULL, 3, 'Use division', '192 divided by 16 equals 12'),
('Year 5', 'Division', 'What is 225 ÷ 15?', '15', NULL, 3, '15 times 15', '225 divided by 15 equals 15'),
('Year 5', 'Division', 'What is 252 ÷ 21?', '12', NULL, 3, 'Use your tables', '252 divided by 21 equals 12'),
('Year 5', 'Division', 'What is 280 ÷ 14?', '20', ARRAY['twenty'], 3, 'Think of 14 times', '280 divided by 14 equals 20'),
('Year 5', 'Division', 'What is 324 ÷ 18?', '18', NULL, 3, '18 times 18', '324 divided by 18 equals 18'),
('Year 5', 'Division', 'What is 360 ÷ 18?', '20', ARRAY['twenty'], 3, 'Use division', '360 divided by 18 equals 20'),
('Year 5', 'Division', 'What is 396 ÷ 22?', '18', NULL, 3, 'Think of 22 times', '396 divided by 22 equals 18'),
('Year 5', 'Division', 'What is 420 ÷ 21?', '20', ARRAY['twenty'], 3, 'Use your tables', '420 divided by 21 equals 20');

-- Year 5: Percentages (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 5', 'Percentages', 'What is 10% of 50?', '5', ARRAY['five'], 2, 'Divide by 10', '10% of 50 equals 5'),
('Year 5', 'Percentages', 'What is 10% of 70?', '7', ARRAY['seven'], 2, 'Divide by 10', '10% of 70 equals 7'),
('Year 5', 'Percentages', 'What is 10% of 130?', '13', NULL, 2, 'Divide by 10', '10% of 130 equals 13'),
('Year 5', 'Percentages', 'What is 10% of 250?', '25', NULL, 2, 'Divide by 10', '10% of 250 equals 25'),
('Year 5', 'Percentages', 'What is 50% of 60?', '30', ARRAY['thirty'], 2, 'Half of 60', '50% of 60 equals 30'),
('Year 5', 'Percentages', 'What is 50% of 90?', '45', NULL, 2, 'Half of 90', '50% of 90 equals 45'),
('Year 5', 'Percentages', 'What is 50% of 140?', '70', ARRAY['seventy'], 2, 'Half of 140', '50% of 140 equals 70'),
('Year 5', 'Percentages', 'What is 25% of 40?', '10', ARRAY['ten'], 2, 'Quarter of 40', '25% of 40 equals 10'),
('Year 5', 'Percentages', 'What is 25% of 100?', '25', NULL, 2, 'Quarter of 100', '25% of 100 equals 25'),
('Year 5', 'Percentages', 'What is 25% of 120?', '30', ARRAY['thirty'], 2, 'Quarter of 120', '25% of 120 equals 30'),
('Year 5', 'Percentages', 'What is 75% of 20?', '15', NULL, 3, 'Three quarters', '75% of 20 equals 15'),
('Year 5', 'Percentages', 'What is 75% of 60?', '45', NULL, 3, 'Three quarters', '75% of 60 equals 45'),
('Year 5', 'Percentages', 'What is 75% of 100?', '75', NULL, 2, 'Three quarters', '75% of 100 equals 75'),
('Year 5', 'Percentages', 'What is 20% of 100?', '20', ARRAY['twenty'], 2, 'One fifth', '20% of 100 equals 20'),
('Year 5', 'Percentages', 'What is 20% of 50?', '10', ARRAY['ten'], 2, 'One fifth', '20% of 50 equals 10'),
('Year 5', 'Percentages', 'What is 20% of 80?', '16', NULL, 3, 'One fifth', '20% of 80 equals 16'),
('Year 5', 'Percentages', 'What is 5% of 100?', '5', ARRAY['five'], 2, 'Half of 10%', '5% of 100 equals 5'),
('Year 5', 'Percentages', 'What is 5% of 80?', '4', ARRAY['four'], 3, 'Half of 10%', '5% of 80 equals 4'),
('Year 5', 'Percentages', 'What is 5% of 60?', '3', ARRAY['three'], 3, 'Half of 10%', '5% of 60 equals 3'),
('Year 5', 'Percentages', 'What is 5% of 40?', '2', ARRAY['two'], 3, 'Half of 10%', '5% of 40 equals 2');

-- Year 5: More Word Problems (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 5', 'Word Problems', 'A cinema ticket costs £8.50. How much for 4 tickets?', '34', ARRAY['£34'], 3, 'Multiply', '£8.50 × 4 = £34'),
('Year 5', 'Word Problems', 'If 3/5 of 30 pupils like football, how many is this?', '18', NULL, 3, 'Find 1/5 first', '3/5 of 30 = 18 pupils'),
('Year 5', 'Word Problems', 'A baker makes 144 cakes and puts 12 in each box. How many boxes?', '12', NULL, 3, 'Divide', '144 ÷ 12 = 12 boxes'),
('Year 5', 'Word Problems', 'If a train travels at 75mph for 2 hours, how far does it go?', '150', NULL, 3, 'Multiply', '75 × 2 = 150 miles'),
('Year 5', 'Word Problems', 'A garden is 12m long and 8m wide. What is its area?', '96', NULL, 3, 'Length × width', '12 × 8 = 96 square meters'),
('Year 5', 'Word Problems', 'If you buy 5 items at £1.80 each, how much in total?', '9', ARRAY['£9'], 3, 'Multiply', '£1.80 × 5 = £9'),
('Year 5', 'Word Problems', 'A rectangle has an area of 60 square cm. If width is 5cm, what is length?', '12', NULL, 3, 'Divide area by width', '60 ÷ 5 = 12cm'),
('Year 5', 'Word Problems', 'If 15% of 80 children wear glasses, how many is this?', '12', NULL, 3, 'Find 15% of 80', '15% of 80 = 12 children'),
('Year 5', 'Word Problems', 'A shop reduces prices by 25%. What is £40 reduced by?', '10', ARRAY['£10'], 3, 'Find 25% of £40', '25% of £40 = £10'),
('Year 5', 'Word Problems', 'If 2/3 of 45 students passed a test, how many passed?', '30', ARRAY['thirty'], 3, 'Find 2/3 of 45', '2/3 of 45 = 30 students'),
('Year 5', 'Word Problems', 'A car uses 7 litres per 100km. How much for 300km?', '21', NULL, 3, 'Triple it', '7 × 3 = 21 litres'),
('Year 5', 'Word Problems', 'If you earn £6.50 per hour for 8 hours, how much in total?', '52', ARRAY['£52'], 3, 'Multiply', '£6.50 × 8 = £52'),
('Year 5', 'Word Problems', 'A box contains 240 chocolates in 12 equal rows. How many per row?', '20', ARRAY['twenty'], 3, 'Divide', '240 ÷ 12 = 20 chocolates'),
('Year 5', 'Word Problems', 'If 4/5 of 60 seats are taken, how many are taken?', '48', NULL, 3, 'Find 4/5 of 60', '4/5 of 60 = 48 seats'),
('Year 5', 'Word Problems', 'A recipe for 6 people needs 450g flour. How much per person?', '75', NULL, 3, 'Divide', '450 ÷ 6 = 75g'),
('Year 5', 'Word Problems', 'If a book has 240 pages and you read 3/4, how many pages?', '180', NULL, 3, 'Find 3/4 of 240', '3/4 of 240 = 180 pages'),
('Year 5', 'Word Problems', 'A shop sells apples at 45p each. How much for 8 apples?', '3.60', ARRAY['£3.60', '360p'], 3, 'Multiply', '45p × 8 = 360p or £3.60'),
('Year 5', 'Word Problems', 'If 30% of 150 people are children, how many children?', '45', NULL, 3, 'Find 30% of 150', '30% of 150 = 45 children'),
('Year 5', 'Word Problems', 'A swimming pool is 25m long. How many lengths for 300m?', '12', NULL, 3, 'Divide', '300 ÷ 25 = 12 lengths'),
('Year 5', 'Word Problems', 'If 5/8 of 64 marbles are red, how many are red?', '40', ARRAY['forty'], 3, 'Find 5/8 of 64', '5/8 of 64 = 40 marbles');

-- Year 5: Algebra Basics (25 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 5', 'Algebra', 'If x + 5 = 12, what is x?', '7', ARRAY['seven'], 2, 'Subtract 5 from 12', 'x = 12 - 5 = 7'),
('Year 5', 'Algebra', 'If x + 8 = 15, what is x?', '7', ARRAY['seven'], 2, 'Subtract 8 from 15', 'x = 15 - 8 = 7'),
('Year 5', 'Algebra', 'If x + 12 = 20, what is x?', '8', ARRAY['eight'], 2, 'Subtract 12 from 20', 'x = 20 - 12 = 8'),
('Year 5', 'Algebra', 'If x - 3 = 10, what is x?', '13', NULL, 2, 'Add 3 to 10', 'x = 10 + 3 = 13'),
('Year 5', 'Algebra', 'If x - 7 = 15, what is x?', '22', NULL, 2, 'Add 7 to 15', 'x = 15 + 7 = 22'),
('Year 5', 'Algebra', 'If x - 9 = 18, what is x?', '27', NULL, 3, 'Add 9 to 18', 'x = 18 + 9 = 27'),
('Year 5', 'Algebra', 'If 2x = 14, what is x?', '7', ARRAY['seven'], 2, 'Divide 14 by 2', 'x = 14 ÷ 2 = 7'),
('Year 5', 'Algebra', 'If 3x = 21, what is x?', '7', ARRAY['seven'], 2, 'Divide 21 by 3', 'x = 21 ÷ 3 = 7'),
('Year 5', 'Algebra', 'If 4x = 24, what is x?', '6', ARRAY['six'], 2, 'Divide 24 by 4', 'x = 24 ÷ 4 = 6'),
('Year 5', 'Algebra', 'If 5x = 30, what is x?', '6', ARRAY['six'], 2, 'Divide 30 by 5', 'x = 30 ÷ 5 = 6'),
('Year 5', 'Algebra', 'If x ÷ 2 = 8, what is x?', '16', NULL, 2, 'Multiply 8 by 2', 'x = 8 × 2 = 16'),
('Year 5', 'Algebra', 'If x ÷ 3 = 9, what is x?', '27', NULL, 2, 'Multiply 9 by 3', 'x = 9 × 3 = 27'),
('Year 5', 'Algebra', 'If x ÷ 4 = 7, what is x?', '28', NULL, 3, 'Multiply 7 by 4', 'x = 7 × 4 = 28'),
('Year 5', 'Algebra', 'If x + 15 = 35, what is x?', '20', ARRAY['twenty'], 2, 'Subtract 15', 'x = 35 - 15 = 20'),
('Year 5', 'Algebra', 'If x - 12 = 25, what is x?', '37', NULL, 3, 'Add 12', 'x = 25 + 12 = 37'),
('Year 5', 'Algebra', 'If 6x = 42, what is x?', '7', ARRAY['seven'], 2, 'Divide by 6', 'x = 42 ÷ 6 = 7'),
('Year 5', 'Algebra', 'If 7x = 49, what is x?', '7', ARRAY['seven'], 2, 'Divide by 7', 'x = 49 ÷ 7 = 7'),
('Year 5', 'Algebra', 'If 8x = 56, what is x?', '7', ARRAY['seven'], 2, 'Divide by 8', 'x = 56 ÷ 8 = 7'),
('Year 5', 'Algebra', 'If x ÷ 5 = 6, what is x?', '30', ARRAY['thirty'], 2, 'Multiply 6 by 5', 'x = 6 × 5 = 30'),
('Year 5', 'Algebra', 'If x + 20 = 50, what is x?', '30', ARRAY['thirty'], 2, 'Subtract 20', 'x = 50 - 20 = 30'),
('Year 5', 'Algebra', 'If 2x + 3 = 15, what is x?', '6', ARRAY['six'], 3, 'Subtract 3, then divide by 2', '2x = 12, so x = 6'),
('Year 5', 'Algebra', 'If 3x + 5 = 20, what is x?', '5', ARRAY['five'], 3, 'Subtract 5, then divide by 3', '3x = 15, so x = 5'),
('Year 5', 'Algebra', 'If 4x - 8 = 20, what is x?', '7', ARRAY['seven'], 3, 'Add 8, then divide by 4', '4x = 28, so x = 7'),
('Year 5', 'Algebra', 'If 2x - 6 = 14, what is x?', '10', ARRAY['ten'], 3, 'Add 6, then divide by 2', '2x = 20, so x = 10'),
('Year 5', 'Algebra', 'If 5x + 10 = 35, what is x?', '5', ARRAY['five'], 3, 'Subtract 10, then divide by 5', '5x = 25, so x = 5');

-- ============================================
-- YEAR 6 ADDITIONAL QUESTIONS (90 questions)
-- ============================================

-- Year 6: More Algebra (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Algebra', 'If 3x + 7 = 25, what is x?', '6', ARRAY['six'], 3, 'Subtract 7, divide by 3', '3x = 18, so x = 6'),
('Year 6', 'Algebra', 'If 4x - 12 = 20, what is x?', '8', ARRAY['eight'], 3, 'Add 12, divide by 4', '4x = 32, so x = 8'),
('Year 6', 'Algebra', 'If 5x + 8 = 38, what is x?', '6', ARRAY['six'], 3, 'Subtract 8, divide by 5', '5x = 30, so x = 6'),
('Year 6', 'Algebra', 'If 6x - 15 = 21, what is x?', '6', ARRAY['six'], 3, 'Add 15, divide by 6', '6x = 36, so x = 6'),
('Year 6', 'Algebra', 'If 2x + 9 = 25, what is x?', '8', ARRAY['eight'], 3, 'Subtract 9, divide by 2', '2x = 16, so x = 8'),
('Year 6', 'Algebra', 'If 7x - 14 = 21, what is x?', '5', ARRAY['five'], 3, 'Add 14, divide by 7', '7x = 35, so x = 5'),
('Year 6', 'Algebra', 'If 8x + 16 = 64, what is x?', '6', ARRAY['six'], 3, 'Subtract 16, divide by 8', '8x = 48, so x = 6'),
('Year 6', 'Algebra', 'If 3x - 5 = 19, what is x?', '8', ARRAY['eight'], 3, 'Add 5, divide by 3', '3x = 24, so x = 8'),
('Year 6', 'Algebra', 'If 9x + 18 = 63, what is x?', '5', ARRAY['five'], 3, 'Subtract 18, divide by 9', '9x = 45, so x = 5'),
('Year 6', 'Algebra', 'If x/2 + 5 = 12, what is x?', '14', NULL, 3, 'Subtract 5, multiply by 2', 'x/2 = 7, so x = 14'),
('Year 6', 'Algebra', 'If x/3 + 4 = 10, what is x?', '18', NULL, 3, 'Subtract 4, multiply by 3', 'x/3 = 6, so x = 18'),
('Year 6', 'Algebra', 'If x/4 - 2 = 3, what is x?', '20', ARRAY['twenty'], 3, 'Add 2, multiply by 4', 'x/4 = 5, so x = 20'),
('Year 6', 'Algebra', 'If x/5 + 3 = 7, what is x?', '20', ARRAY['twenty'], 3, 'Subtract 3, multiply by 5', 'x/5 = 4, so x = 20'),
('Year 6', 'Algebra', 'If 10x - 20 = 50, what is x?', '7', ARRAY['seven'], 3, 'Add 20, divide by 10', '10x = 70, so x = 7'),
('Year 6', 'Algebra', 'If 4x + 24 = 52, what is x?', '7', ARRAY['seven'], 3, 'Subtract 24, divide by 4', '4x = 28, so x = 7'),
('Year 6', 'Algebra', 'If 5x - 25 = 25, what is x?', '10', ARRAY['ten'], 3, 'Add 25, divide by 5', '5x = 50, so x = 10'),
('Year 6', 'Algebra', 'If 6x + 18 = 48, what is x?', '5', ARRAY['five'], 3, 'Subtract 18, divide by 6', '6x = 30, so x = 5'),
('Year 6', 'Algebra', 'If 7x - 28 = 21, what is x?', '7', ARRAY['seven'], 3, 'Add 28, divide by 7', '7x = 49, so x = 7'),
('Year 6', 'Algebra', 'If 12x = 84, what is x?', '7', ARRAY['seven'], 3, 'Divide by 12', 'x = 84 ÷ 12 = 7'),
('Year 6', 'Algebra', 'If 15x = 90, what is x?', '6', ARRAY['six'], 3, 'Divide by 15', 'x = 90 ÷ 15 = 6');

-- Year 6: More Word Problems (25 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Word Problems', 'A £60 jacket is reduced by 20%. What is the new price?', '48', ARRAY['£48'], 3, 'Find 20% and subtract', '20% of £60 = £12, so £60 - £12 = £48'),
('Year 6', 'Word Problems', 'If 3/8 of 96 students play an instrument, how many is this?', '36', NULL, 3, 'Find 1/8 first', '3/8 of 96 = 36 students'),
('Year 6', 'Word Problems', 'A rectangle has perimeter 36cm. If width is 7cm, what is length?', '11', NULL, 3, 'Use perimeter formula', '(36 - 14) ÷ 2 = 11cm'),
('Year 6', 'Word Problems', 'If you increase £50 by 30%, what is the new amount?', '65', ARRAY['£65'], 3, 'Find 30% and add', '30% of £50 = £15, so £50 + £15 = £65'),
('Year 6', 'Word Problems', 'A triangle has angles 45° and 65°. What is the third angle?', '70', NULL, 3, 'Angles sum to 180°', '180° - 45° - 65° = 70°'),
('Year 6', 'Word Problems', 'If 7/10 of 80 tickets are sold, how many are left?', '24', NULL, 3, 'Find 3/10 of 80', '3/10 of 80 = 24 tickets'),
('Year 6', 'Word Problems', 'A car travels 324 miles in 4.5 hours. What is the average speed?', '72', NULL, 3, 'Divide distance by time', '324 ÷ 4.5 = 72 mph'),
('Year 6', 'Word Problems', 'If 35% of 140 pupils walk to school, how many walk?', '49', NULL, 3, 'Find 35% of 140', '35% of 140 = 49 pupils'),
('Year 6', 'Word Problems', 'A shop buys items for £12 and sells for £18. What is the percentage profit?', '50', NULL, 3, 'Profit ÷ cost × 100', '(£6 ÷ £12) × 100 = 50%'),
('Year 6', 'Word Problems', 'If 5/6 of 72 seats are taken, how many are empty?', '12', NULL, 3, 'Find 1/6 of 72', '1/6 of 72 = 12 seats'),
('Year 6', 'Word Problems', 'A square garden has area 144 square meters. What is the side length?', '12', NULL, 3, 'Square root of 144', '√144 = 12 meters'),
('Year 6', 'Word Problems', 'If you save £8.50 per week for 16 weeks, how much in total?', '136', ARRAY['£136'], 3, 'Multiply', '£8.50 × 16 = £136'),
('Year 6', 'Word Problems', 'A recipe serves 6 people and needs 450ml milk. How much for 8 people?', '600', NULL, 3, 'Scale up proportionally', '450 ÷ 6 × 8 = 600ml'),
('Year 6', 'Word Problems', 'If 12% of 250 books are fiction, how many fiction books?', '30', ARRAY['thirty'], 3, 'Find 12% of 250', '12% of 250 = 30 books'),
('Year 6', 'Word Problems', 'A cyclist travels at 18 km/h. How far in 2.5 hours?', '45', NULL, 3, 'Speed × time', '18 × 2.5 = 45 km'),
('Year 6', 'Word Problems', 'If a shirt costs £24 after a 25% discount, what was the original price?', '32', ARRAY['£32'], 3, '£24 is 75% of original', '£24 ÷ 0.75 = £32'),
('Year 6', 'Word Problems', 'A tank holds 240 litres. If 5/8 is full, how many litres in it?', '150', NULL, 3, 'Find 5/8 of 240', '5/8 of 240 = 150 litres'),
('Year 6', 'Word Problems', 'If you buy 18 items at 75p each, how much in total?', '13.50', ARRAY['£13.50'], 3, 'Multiply', '18 × 75p = £13.50'),
('Year 6', 'Word Problems', 'A £80 game is increased by 15%. What is the new price?', '92', ARRAY['£92'], 3, 'Find 15% and add', '15% of £80 = £12, so £80 + £12 = £92'),
('Year 6', 'Word Problems', 'If 7/12 of 84 apples are red, how many are red?', '49', NULL, 3, 'Find 7/12 of 84', '7/12 of 84 = 49 apples'),
('Year 6', 'Word Problems', 'A rectangle has area 180 sq cm and length 15cm. What is the width?', '12', NULL, 3, 'Divide area by length', '180 ÷ 15 = 12cm'),
('Year 6', 'Word Problems', 'If 65% of 200 students pass an exam, how many pass?', '130', NULL, 3, 'Find 65% of 200', '65% of 200 = 130 students'),
('Year 6', 'Word Problems', 'A train travels 225 miles in 3 hours. What is the average speed?', '75', NULL, 3, 'Divide distance by time', '225 ÷ 3 = 75 mph'),
('Year 6', 'Word Problems', 'If you decrease 120 by 35%, what is the new amount?', '78', NULL, 3, 'Find 35% and subtract', '35% of 120 = 42, so 120 - 42 = 78'),
('Year 6', 'Word Problems', 'A cube has volume 125 cubic cm. What is the length of each edge?', '5', ARRAY['five'], 3, 'Cube root of 125', '∛125 = 5cm');

-- Year 6: Statistics and Data (20 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Statistics', 'What is the mean of 5, 7, 9, 11, 13?', '9', ARRAY['nine'], 2, 'Add and divide by 5', '(5+7+9+11+13) ÷ 5 = 9'),
('Year 6', 'Statistics', 'What is the mean of 10, 15, 20, 25?', '17.5', NULL, 3, 'Add and divide by 4', '(10+15+20+25) ÷ 4 = 17.5'),
('Year 6', 'Statistics', 'What is the mean of 8, 12, 16?', '12', NULL, 2, 'Add and divide by 3', '(8+12+16) ÷ 3 = 12'),
('Year 6', 'Statistics', 'What is the median of 3, 7, 11, 15, 19?', '11', NULL, 2, 'Middle value', 'The middle value is 11'),
('Year 6', 'Statistics', 'What is the median of 4, 8, 12, 16?', '10', ARRAY['ten'], 3, 'Average of middle two', '(8+12) ÷ 2 = 10'),
('Year 6', 'Statistics', 'What is the range of 2, 5, 9, 14, 20?', '18', NULL, 2, 'Highest - lowest', '20 - 2 = 18'),
('Year 6', 'Statistics', 'What is the range of 15, 22, 28, 35, 40?', '25', NULL, 2, 'Highest - lowest', '40 - 15 = 25'),
('Year 6', 'Statistics', 'What is the mode of 3, 5, 5, 7, 9, 5?', '5', ARRAY['five'], 2, 'Most common value', '5 appears most often'),
('Year 6', 'Statistics', 'What is the mean of 6, 8, 10, 12, 14?', '10', ARRAY['ten'], 2, 'Add and divide by 5', '(6+8+10+12+14) ÷ 5 = 10'),
('Year 6', 'Statistics', 'What is the median of 5, 10, 15, 20, 25?', '15', NULL, 2, 'Middle value', 'The middle value is 15'),
('Year 6', 'Statistics', 'What is the range of 8, 15, 22, 30, 38?', '30', ARRAY['thirty'], 2, 'Highest - lowest', '38 - 8 = 30'),
('Year 6', 'Statistics', 'What is the mode of 7, 9, 11, 9, 13, 9?', '9', ARRAY['nine'], 2, 'Most common', '9 appears most often'),
('Year 6', 'Statistics', 'What is the mean of 4, 7, 10, 13?', '8.5', NULL, 3, 'Add and divide by 4', '(4+7+10+13) ÷ 4 = 8.5'),
('Year 6', 'Statistics', 'What is the median of 2, 6, 10, 14, 18, 22?', '12', NULL, 3, 'Average of middle two', '(10+14) ÷ 2 = 12'),
('Year 6', 'Statistics', 'What is the range of 12, 18, 24, 30, 36, 42?', '30', ARRAY['thirty'], 2, 'Highest - lowest', '42 - 12 = 30'),
('Year 6', 'Statistics', 'What is the mean of 20, 25, 30, 35, 40?', '30', ARRAY['thirty'], 2, 'Add and divide by 5', '(20+25+30+35+40) ÷ 5 = 30'),
('Year 6', 'Statistics', 'What is the median of 1, 4, 7, 10, 13?', '7', ARRAY['seven'], 2, 'Middle value', 'The middle value is 7'),
('Year 6', 'Statistics', 'What is the range of 5, 12, 19, 26, 33?', '28', NULL, 2, 'Highest - lowest', '33 - 5 = 28'),
('Year 6', 'Statistics', 'What is the mode of 4, 6, 8, 6, 10, 6, 12?', '6', ARRAY['six'], 2, 'Most common', '6 appears most often'),
('Year 6', 'Statistics', 'What is the mean of 15, 18, 21, 24, 27?', '21', NULL, 2, 'Add and divide by 5', '(15+18+21+24+27) ÷ 5 = 21');

-- Year 6: Geometry (15 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Geometry', 'How many degrees in a full turn?', '360', NULL, 2, 'Full circle', 'A full turn is 360 degrees'),
('Year 6', 'Geometry', 'How many degrees in a right angle?', '90', ARRAY['ninety'], 1, 'Quarter turn', 'A right angle is 90 degrees'),
('Year 6', 'Geometry', 'How many degrees in a straight line?', '180', NULL, 2, 'Half turn', 'A straight line is 180 degrees'),
('Year 6', 'Geometry', 'What is the sum of angles in a triangle?', '180', NULL, 2, 'Always 180°', 'Triangle angles sum to 180 degrees'),
('Year 6', 'Geometry', 'What is the sum of angles in a quadrilateral?', '360', NULL, 3, 'Four-sided shape', 'Quadrilateral angles sum to 360 degrees'),
('Year 6', 'Geometry', 'If two angles in a triangle are 60° each, what is the third?', '60', ARRAY['sixty'], 2, 'Sum to 180°', '180° - 60° - 60° = 60°'),
('Year 6', 'Geometry', 'If two angles in a triangle are 50° and 70°, what is the third?', '60', ARRAY['sixty'], 2, 'Sum to 180°', '180° - 50° - 70° = 60°'),
('Year 6', 'Geometry', 'If two angles in a triangle are 35° and 85°, what is the third?', '60', ARRAY['sixty'], 3, 'Sum to 180°', '180° - 35° - 85° = 60°'),
('Year 6', 'Geometry', 'What is the name of a triangle with all sides equal?', 'equilateral', NULL, 2, 'Equal sides', 'An equilateral triangle has all sides equal'),
('Year 6', 'Geometry', 'What is the name of a triangle with two sides equal?', 'isosceles', NULL, 2, 'Two equal sides', 'An isosceles triangle has two equal sides'),
('Year 6', 'Geometry', 'How many lines of symmetry does a square have?', '4', ARRAY['four'], 2, 'Fold lines', 'A square has 4 lines of symmetry'),
('Year 6', 'Geometry', 'How many lines of symmetry does a rectangle have?', '2', ARRAY['two'], 2, 'Fold lines', 'A rectangle has 2 lines of symmetry'),
('Year 6', 'Geometry', 'How many lines of symmetry does an equilateral triangle have?', '3', ARRAY['three'], 2, 'Fold lines', 'An equilateral triangle has 3 lines of symmetry'),
('Year 6', 'Geometry', 'If one angle in a rectangle is 90°, what are the others?', '90', ARRAY['ninety'], 2, 'All right angles', 'All angles in a rectangle are 90°'),
('Year 6', 'Geometry', 'What is half of 360 degrees?', '180', NULL, 2, 'Half turn', 'Half of 360° is 180°');

-- Year 6: More Advanced Fractions (10 questions)
INSERT INTO questions (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation) VALUES
('Year 6', 'Fractions', 'What is 5/8 + 1/8?', '3/4', ARRAY['6/8'], 2, 'Simplify', '6/8 simplifies to 3/4'),
('Year 6', 'Fractions', 'What is 7/10 - 1/10?', '3/5', ARRAY['6/10'], 2, 'Simplify', '6/10 simplifies to 3/5'),
('Year 6', 'Fractions', 'What is 1/4 × 8?', '2', ARRAY['two'], 2, 'Quarter of 8', '1/4 of 8 = 2'),
('Year 6', 'Fractions', 'What is 2/3 × 9?', '6', ARRAY['six'], 2, 'Two thirds of 9', '2/3 of 9 = 6'),
('Year 6', 'Fractions', 'What is 3/4 × 20?', '15', NULL, 3, 'Find 1/4 first', '3/4 of 20 = 15'),
('Year 6', 'Fractions', 'What is 4/5 × 25?', '20', ARRAY['twenty'], 3, 'Find 1/5 first', '4/5 of 25 = 20'),
('Year 6', 'Fractions', 'What is 5/6 × 24?', '20', ARRAY['twenty'], 3, 'Find 1/6 first', '5/6 of 24 = 20'),
('Year 6', 'Fractions', 'What is 7/8 × 16?', '14', NULL, 3, 'Find 1/8 first', '7/8 of 16 = 14'),
('Year 6', 'Fractions', 'What is 3/10 × 50?', '15', NULL, 3, 'Find 1/10 first', '3/10 of 50 = 15'),
('Year 6', 'Fractions', 'What is 4/7 × 21?', '12', NULL, 3, 'Find 1/7 first', '4/7 of 21 = 12');

-- ============================================
-- SUMMARY OF ADDITIONS
-- ============================================
-- Year 1: 70 new questions (Numbers: 15, Addition: 25, Subtraction: 30)
-- Year 2: 90 new questions (Subtraction: 25, Division: 20, Money: 25, Numbers: 20)
-- Year 3: 85 new questions (Subtraction: 20, Fractions: 20, Money: 20, Time: 25)
-- Year 4: 90 new questions (Addition: 20, Subtraction: 20, Decimals: 20, Area/Perimeter: 15, Word Problems: 15)
-- Year 5: 85 new questions (Division: 20, Percentages: 20, Word Problems: 20, Algebra: 25)
-- Year 6: 90 new questions (Algebra: 20, Word Problems: 25, Statistics: 20, Geometry: 15, Fractions: 10)
--
-- TOTAL NEW QUESTIONS: 510
-- GRAND TOTAL (with original 245): 755 questions
--
-- All new questions follow the same format as the original set with:
-- - Proper year_group, subject, question_text, correct_answer
-- - Alternative answers where appropriate
-- - Difficulty levels 1-3
-- - Hints and explanations
