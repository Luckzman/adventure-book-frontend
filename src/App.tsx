import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { BooksProvider } from './contexts/BooksProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BooksProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:gamePath" element={<GamePage />} />
          </Routes>
        </BrowserRouter>
      </BooksProvider>
    </ErrorBoundary>
  );
}

export default App;
