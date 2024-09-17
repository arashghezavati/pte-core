import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Rs from '../components/speaking/Rs.js';
import DescribeImage from '../components/speaking/DescribeImage.tsx';
import RetellLecture from '../components/speaking/RetellLecture.tsx';
import AnswerShortQuestion from '../components/speaking/AnswerShortQuestion.tsx';

const SpeakingPage = () => {
  return (
    <div className='sst-page'>
      <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">PTE Practice</a>
      </div>
      <input type="checkbox" id="nav-toggle" className="nav-toggle"/>
      <label htmlFor="nav-toggle" className="nav-toggle-label">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <ul className="nav-menu">
        <li><a href="#speaking">Speaking</a></li>
        <li><a href="#writing">Writing</a></li>
        <li><a href="#listening">Listening</a></li>
        <li><a href="#reading">Reading</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    </nav>
      <Routes>
        <Route path="rs" element={<Rs />} />
        <Route path="describe-image" element={<DescribeImage />} />
        <Route path="retell-lecture" element={<RetellLecture />} />
        <Route path="answer-short-question" element={<AnswerShortQuestion />} />
      </Routes>
    </div>
  );
};

export default SpeakingPage;
