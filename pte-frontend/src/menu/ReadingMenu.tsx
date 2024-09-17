import React from 'react';
import { Link } from 'react-router-dom';

const ReadingMenu = () => {
  return (
    <div>
      <h2>Reading</h2>
      <ul>
        <li><Link to="/reading/rwfib">Reading & Writing: Fill in the Blanks</Link></li>
        <li><Link to="/reading/mcma">Multiple Choice: Multiple Answers</Link></li>
        <li><Link to="/reading/mcaa">Multiple Choice: Single Answer</Link></li>
        <li><Link to="/reading/rfib">Reading: Fill in the Blanks</Link></li>
        <li><Link to="/reading/rop">Re-order Paragraphs</Link></li>
      </ul>
    </div>
  );
};

export default ReadingMenu;
