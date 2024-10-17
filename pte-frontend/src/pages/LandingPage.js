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
        <h2>Key Features</h2>
        <div className="features-container">
          <div className="feature">
            <div className="icon-container">
              <i className="fas fa-book"></i>
            </div>
            <h3>Real Exam Questions</h3>
            <p>Practice with questions that mirror the actual PTE exam.</p>
          </div>
          <div className="feature">
            <div className="icon-container">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Instant Feedback</h3>
            <p>Receive immediate feedback on your answers.</p>
          </div>
          <div className="feature">
            <div className="icon-container">
              <i className="fas fa-user-cog"></i>
            </div>
            <h3>Personalized Practice Plans</h3>
            <p>Get practice plans tailored to your needs.</p>
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2>Why Choose Us?</h2>
        <div className="details-container">
          <div className="detail-card">
            <h3>Comprehensive Resources</h3>
            <p>Access a wealth of resources including study materials, video tutorials, and practice exams to ensure thorough preparation.</p>
          </div>
          <div className="detail-card">
            <h3>Expert Guidance</h3>
            <p>Learn from experienced instructors who provide tips and strategies to excel in the PTE exam.</p>
          </div>
          <div className="detail-card">
            <h3>Flexible Learning</h3>
            <p>Study at your own pace with a flexible schedule that fits your lifestyle.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of successful students and start your journey to mastering the PTE exam today!</p>
        <div className="cta-buttons">
          <button className="cta-button" onClick={handleLogin}>Log In</button>
          <button className="cta-button signup" onClick={handleSignup}>Sign Up</button>
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
