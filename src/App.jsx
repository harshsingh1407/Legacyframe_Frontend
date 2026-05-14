import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Videos from './pages/Videos';
import BookNow from './pages/BookNow';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/book" element={<BookNow />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        toastStyle={{ background: '#111111', border: '1px solid #2a2a2a', color: '#fff', fontFamily: 'inherit', fontSize: '13px' }}
      />
    </Router>
  );
}

export default App;
