import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RepositoryProvider } from './context/RepositoryContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import Header from './components/Header';

function App() {
  return (
    <ThemeProvider>
      <RepositoryProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </RepositoryProvider>
    </ThemeProvider>
  );
}

export default App;
