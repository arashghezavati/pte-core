

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Ensure path is correct
import LoginForm from './components/auth/LoginForm'; // Ensure path is correct
import SignupForm from './components/auth/SignupForm'; // Ensure path is correct
import SpeakingPage from './pages/SpeakingPage.tsx';
import WritingPage from './pages/WritingPage.tsx';
import ReadingPage from './pages/ReadingPage.tsx';
import ListeningPage from './pages/ListeningPage.tsx';
import LandingPage from './pages/LandingPage.js';
import PracticePage from './pages/PracticePage.tsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      {/* <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/speaking">Speaking</Link></li>
        <li><Link to="/writing">Writing</Link></li>
        <li><Link to="/reading">Reading</Link></li>
        <li><Link to="/listening">Listening</Link></li>
        {user ? (
          <>
            <li>Hello, {user.name}</li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul> */}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/speaking/*" element={<SpeakingPage />} />
            <Route path="/writing/*" element={<WritingPage />} />
            <Route path="/reading/*" element={<ReadingPage />} />
            <Route path="/listening/*" element={<ListeningPage />} />
            <Route path='/PracticePage/*' element={<PracticePage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
