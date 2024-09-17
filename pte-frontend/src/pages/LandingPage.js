

// export default LandingPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Master the PTE Exam with Real Practice Questions</h1>
          <p>Prepare with the latest exam questions and boost your confidence.</p>
          <div className="cta-buttons">
            <button className="cta-button" onClick={handleLogin}>Log In</button>
            <button className="cta-button signup" onClick={handleSignup}>Sign Up</button>
          </div>
        </div>
      </header>
      <section className="features-section">
        <div className="feature">
          <i className="fas fa-book"></i>
          <h3>Real Exam Questions</h3>
          <p>Practice with questions that mirror the actual PTE exam.</p>
        </div>
        <div className="feature">
          <i className="fas fa-chart-line"></i>
          <h3>Instant Feedback</h3>
          <p>Receive immediate feedback on your answers.</p>
        </div>
        <div className="feature">
          <i className="fas fa-user-cog"></i>
          <h3>Personalized Practice Plans</h3>
          <p>Get practice plans tailored to your needs.</p>
        </div>
      </section>
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"This platform helped me score high on my PTE exam!"</p>
          <h4>- John Doe</h4>
        </div>
        <div className="testimonial">
          <p>"The practice questions were exactly like the real exam."</p>
          <h4>- Jane Smith</h4>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2024 PTE Practice Platform. All rights reserved.</p>
        <div className="social-links">
          <a href="#facebook">Facebook</a>
          <a href="#twitter">Twitter</a>
          <a href="#instagram">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
