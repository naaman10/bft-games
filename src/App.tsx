import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GameRouter from './components/GameRouter';
import GamesList from './components/GamesList';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<GamesList />} />
          <Route path="/game/:gameId" element={<GameRouter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
