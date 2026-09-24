import { useState } from 'react';
import './SubjectSelector.css';

interface SubjectSelectorProps {
  onSelect: (yearGroup: string, subject: string) => void;
}

const YEAR_GROUPS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];

// Map year groups to their available subjects based on question bank
const SUBJECTS_BY_YEAR: Record<string, string[]> = {
  'Year 1': ['Addition', 'Subtraction'],
  'Year 2': ['Addition', 'Multiplication'],
  'Year 3': ['Addition', 'Multiplication', 'Division'],
  'Year 4': ['Multiplication', 'Division', 'Fractions'],
  'Year 5': ['Multiplication', 'Fractions', 'Decimals'],
  'Year 6': ['Percentages', 'Fractions', 'Decimals', 'Ratio'],
};

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSelect }) => {
  const [selectedYear, setSelectedYear] = useState<string>('Year 6');
  const [selectedSubject, setSelectedSubject] = useState<string>('Percentages');

  const availableSubjects = SUBJECTS_BY_YEAR[selectedYear] || [];

  // When year changes, set subject to first available for that year
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    const subjects = SUBJECTS_BY_YEAR[year] || [];
    if (subjects.length > 0) {
      setSelectedSubject(subjects[0]);
    }
  };

  const handleStart = () => {
    console.log('[SubjectSelector] Start button clicked:', { selectedYear, selectedSubject });
    onSelect(selectedYear, selectedSubject);
    console.log('[SubjectSelector] onSelect called');
  };

  return (
    <div className="subject-selector">
      <div className="selector-container">
        <div className="selector-header">
          <img src="/assets/Misc/ui/bft-sun-64.png" alt="" className="selector-logo" />
          <h1>Gem Hunt</h1>
          <p className="selector-tagline">Answer questions, collect gems!</p>
        </div>

        <div className="selector-form">
          <div className="form-group">
            <label htmlFor="year-select">What year are you in?</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="year-select"
            >
              {YEAR_GROUPS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject-select">What subject do you want to practice?</label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-select"
            >
              {availableSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="selector-info">
            <p>
              You'll answer <strong>{selectedSubject}</strong> questions for <strong>{selectedYear}</strong>.
            </p>
            <p className="info-detail">
              Answer 5 questions correctly to earn moves, then collect gems in the platformer!
            </p>
          </div>

          <button type="button" className="start-button" onClick={handleStart}>
            Start Game
          </button>
        </div>

        <div className="selector-footer">
          <p className="help-text">Choose your year and subject to begin</p>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
