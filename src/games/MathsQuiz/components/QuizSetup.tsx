import React, { useState, useEffect } from 'react';
import { QuizConfig } from '../types/quiz';
import * as quizApi from '../services/api';
import './QuizSetup.css';

type QuizSetupProps = {
  onStart: (config: QuizConfig) => void;
  token?: string | null;
  isAuthenticated?: boolean;
  username?: string | null;
};

export const QuizSetup: React.FC<QuizSetupProps> = ({ onStart, token, isAuthenticated = false, username = null }) => {
  const [yearGroups, setYearGroups] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedYearGroup, setSelectedYearGroup] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    loadYearGroups();
  }, []);

  useEffect(() => {
    if (selectedYearGroup) {
      loadSubjects(selectedYearGroup);
    }
  }, [selectedYearGroup]);

  const loadYearGroups = async () => {
    setLoading(true);
    try {
      const groups = await quizApi.getYearGroups(token);
      setYearGroups(groups);
      if (groups.length > 0) {
        setSelectedYearGroup(groups[groups.length - 1]); // Default to Year 6
      }
    } catch (error) {
      console.error('Failed to load year groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async (yearGroup: string) => {
    try {
      const subs = await quizApi.getSubjects(yearGroup, token);
      setSubjects(subs);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const handleStart = () => {
    if (!selectedYearGroup) {
      alert('Please select a year group');
      return;
    }

    const config: QuizConfig = {
      yearGroup: selectedYearGroup,
      subject: selectedSubject,
      questionCount,
    };

    onStart(config);
  };

  if (loading) {
    return (
      <div className="quiz-setup">
        <div className="quiz-setup-loading">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-setup">
      <div className="quiz-setup-container">
        <h1 className="quiz-setup-title">Maths Quiz Generator</h1>
        <p className="quiz-setup-subtitle">
          Create your custom maths quiz! Select your year group, choose a subject, and decide how many questions you want.
        </p>

        {isAuthenticated && username && (
          <div className="auth-status">
            <p>👤 Welcome, {username}!</p>
          </div>
        )}

        <div className="quiz-setup-form">
          {/* Year Group Selection */}
          <div className="form-group">
            <label htmlFor="year-group">Year Group</label>
            <select
              id="year-group"
              value={selectedYearGroup}
              onChange={(e) => setSelectedYearGroup(e.target.value)}
              className="form-select"
            >
              {yearGroups.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selection */}
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              value={selectedSubject || 'all'}
              onChange={(e) => setSelectedSubject(e.target.value === 'all' ? null : e.target.value)}
              className="form-select"
            >
              <option value="all">All Subjects (Mixed)</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div className="form-group">
            <label htmlFor="question-count">
              Number of Questions: {questionCount}
            </label>
            <input
              type="range"
              id="question-count"
              min="5"
              max="20"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="form-range"
            />
            <div className="range-labels">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
            </div>
          </div>

          {/* Start Button */}
          <button onClick={handleStart} className="btn-start-quiz">
            Start Quiz
          </button>
        </div>

        <div className="quiz-setup-info">
          <div className="info-card">
            <h3>📊 Your Quiz</h3>
            <p><strong>Year:</strong> {selectedYearGroup}</p>
            <p><strong>Subject:</strong> {selectedSubject || 'All Subjects'}</p>
            <p><strong>Questions:</strong> {questionCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
