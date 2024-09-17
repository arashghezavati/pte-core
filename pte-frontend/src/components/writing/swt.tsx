import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './Swt.css';
import { Link } from 'react-router-dom';
import { FaBook, FaPenFancy, FaMicrophone, FaHeadphones } from 'react-icons/fa';

const Swt: React.FC = () => {
  const [swts, setSwts] = useState<{ question: string, answer: string }[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(10);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [change, setChange] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/swt");
        setSwts(response.data);
      } catch (error) {
        console.error("Error fetching swt data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isRunning && timer > 0) {
      timeout = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShow(true);
      setIsRunning(false);
    }

    return () => clearTimeout(timeout);
  }, [timer, isRunning]);

  const onStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setTimer(0);
      setShow(true);
    } else {
      // Restart the timer
      setIsRunning(true);
      setTimer(10); // Reset timer to 10 seconds
      setShow(false);
      setText(""); // Clear the previous text
      setChange(""); // Clear the input
    }
  };

  const goToNextText = () => {
    if (currentTextIndex < swts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      setCurrentTextIndex(0);
    }
    resetTimer();
  };

  const gotTopreviousText = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex(currentTextIndex - 1);
    } else {
      setCurrentTextIndex(swts.length - 1);
    }
    resetTimer();
  };

  const resetTimer = () => {
    setTimer(10);
    setIsRunning(true);
    setChange("");
    setText("");
    setShow(false);
  };

  return (
    <div className="swt-page">
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
          <li><a href="#speaking"><FaMicrophone /> Speaking</a></li>
          <li><a href="#writing"><FaPenFancy /> Writing</a></li>
          <li><a href="#listening"><FaHeadphones /> Listening</a></li>
          <li><a href="#reading"><FaBook /> Reading</a></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>

      <div className="swt-content">
        <Card 
          title="Summarize Written Text (SWT)"
          timer={<span >{timer} seconds</span>}
          footer={
            <>
              <span className="page-indicator">{currentTextIndex + 1} / {swts.length}</span>
              <div className="navigation-buttons">
                <button className="nav-button" onClick={gotTopreviousText}>Previous</button>
                <button className="nav-button" onClick={goToNextText}>Next</button>
              </div>
            </>
          }
        >
          {swts.length > 0 && (
            <>
              <p className="problem-description">
                Read the passage below and summarize it using one sentence. You have 10 minutes to finish this task. Your response will be judged on the quality of your writing and how well you present the key points.
              </p>
              <p className="question-text">{swts[currentTextIndex].question}</p>
              <input
                type="text"
                value={change}
                onChange={(e) => setChange(e.target.value)}
                className="input-box"
              />
              {show ? (
                <p className="written-text">{text}</p>
              ) : (
                <p>Your answer comes up here</p>
              )}
              <button className="stop-button" onClick={onStop}>
                {isRunning ? "Stop" : "Start Again"}
              </button>
              {show && (
                <p className="suggested-answer">Suggested Answer: {swts[currentTextIndex].answer}</p>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Swt;
