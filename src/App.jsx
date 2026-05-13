import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import BookNow from './pages/BookNow';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b0b0b] text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/book" element={<BookNow />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
