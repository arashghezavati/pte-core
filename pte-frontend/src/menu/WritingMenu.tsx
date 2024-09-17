import React from 'react';
import { Link } from 'react-router-dom';

const WritingMenu = () => {
  return (
    <div>
      <h2>Writing</h2>
      <ul>
        <li><Link to="/writing/swt">Summarize Written Text</Link></li>
        <li><Link to="/writing/we">Write Essay</Link></li>
      </ul>
    </div>
  );
};

export default WritingMenu;
