import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { BooksProvider } from './contexts/BooksContext';
import './App.css';

function App() {
  return (
    <BooksProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:gamePath" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </BooksProvider>
  );
}

export default App;
