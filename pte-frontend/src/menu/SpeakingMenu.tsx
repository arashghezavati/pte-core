import React from 'react';
import { Link } from 'react-router-dom';

const SpeakingMenu = () => {
  return (
    <div>
      <h2>Speaking</h2>
      <ul>
        <li><Link to="/speaking/rs">Repeat Sentence</Link></li>
        <li><Link to="/speaking/describe-image">Describe Image</Link></li>
        <li><Link to="/speaking/retell-lecture">Retell Lecture</Link></li>
        <li><Link to="/speaking/answer-short-question">Answer Short Question</Link></li>
      </ul>
    </div>
  );
};

export default SpeakingMenu;
