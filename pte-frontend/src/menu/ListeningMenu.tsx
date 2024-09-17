import React from 'react';
import { Link } from 'react-router-dom';

const ListeningMenu = () => {
  return (
    <div>
      <h2>Listening</h2>
      <ul>
        <li><Link to="/listening/sst">Summarize Spoken Text</Link></li>
        <li><Link to="/listening/mc">Multiple choice, choose multiple answers</Link></li>
        <li><Link to="/listening/lfib">Fill in the Blanks</Link></li>
        <li><Link to="/listening/hcs">Highlight Correct Summary</Link></li>
        <li><Link to="/listening/csa">Choose single answer</Link></li>
        <li><Link to="/listening/smw">Select missing Words</Link></li>
        <li><Link to="/listening/wfd">Write from Dictation</Link></li>
        <li><Link to="/listening/hiw">Highlight Incorrect Words</Link></li>
      </ul>
    </div>
  );
};

export default ListeningMenu;
