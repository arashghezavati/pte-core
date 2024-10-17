
import React from 'react';
import { Link } from 'react-router-dom';
import './PracticePage.css';
import { FaBook, FaPenFancy, FaMicrophone, FaHeadphones } from 'react-icons/fa';

const PracticePage = () => {
    return (
        <div className="practice-page">
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/">PTE Practice</Link>
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
                    <li><Link to="/" onClick={() => { /* Optional: Add logout logic here */ }}>Logout</Link></li> {/* Updated here */}
                </ul>
            </nav>

            <div className="section-container">
                <div className="section" id="speaking">
                    <h2><FaMicrophone /> Speaking</h2>
                    <div className="subsection">
                        {/* <Link to="/speaking/rs" className="subsection-link">Repeat Sentence</Link> */}
                        <Link to="/speaking/describe-image" className="subsection-link">Describe Image</Link>
                        <Link to="/speaking/retell-lecture" className="subsection-link">Retell Lecture</Link>
                        <Link to="/speaking/answer-short-question" className="subsection-link">Answer Short Question</Link>
                    </div>
                </div>

                <div className="section" id="writing">
                    <h2><FaPenFancy /> Writing</h2>
                    <div className="subsection">
                        <Link to="/writing/swt" className="subsection-link">Summarize Written Text</Link>
                        <Link to="/writing/we" className="subsection-link">Write Essay</Link>
                    </div>
                </div>
            </div>

            <div className="section-container">
                <div className="section" id="reading">
                    <h2><FaBook /> Reading</h2>
                    <div className="subsection">
                        <Link to="/reading/rwfib" className="subsection-link">Reading & Writing: Fill in the Blanks</Link>
                        <Link to="/reading/mcma" className="subsection-link">Multiple Choice: Multiple Answers</Link>
                        <Link to="/reading/mcaa" className="subsection-link">Multiple Choice: Single Answer</Link>
                        <Link to="/reading/rfib" className="subsection-link">Reading: Fill in the Blanks</Link>
                        <Link to="/reading/rop" className="subsection-link">Re-order Paragraphs</Link>
                    </div>
                </div>

                <div className="section" id="listening">
                    <h2><FaHeadphones /> Listening</h2>
                    <div className="subsection">
                        <Link to="/listening/sst" className="subsection-link">Summarize Spoken Text</Link>
                        <Link to="/listening/mc" className="subsection-link">Multiple choice, choose multiple answers</Link>
                        <Link to="/listening/lfib" className="subsection-link">Fill in the Blanks</Link>
                        <Link to="/listening/hcs" className="subsection-link">Highlight Correct Summary</Link>
                        <Link to="/listening/csa" className="subsection-link">Choose single answer</Link>
                        <Link to="/listening/smw" className="subsection-link">Select Missing Words</Link>
                        <Link to="/listening/wfd" className="subsection-link">Write from Dictation</Link>
                        <Link to="/listening/hiw" className="subsection-link">Highlight Incorrect Words</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticePage;
