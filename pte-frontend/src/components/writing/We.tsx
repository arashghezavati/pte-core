import React, { useEffect, useState } from "react";
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './We.css';
import { Link } from 'react-router-dom';
import { FaBook, FaPenFancy, FaMicrophone, FaHeadphones } from 'react-icons/fa';

const We: React.FC = () => {
  const [wes, setWes] = useState<{ question: string; answer: string }[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(20 * 60); // 20 minutes in seconds
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [change, setChange] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/we");
        setWes(response.data);
      } catch (error) {
        console.error("Error fetching we data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    if (isRunning && timer > 0) {
      timeOut = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShow(true);
      setIsRunning(false);
    }

    return () => clearTimeout(timeOut);
  }, [timer, isRunning]);

  const onStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setTimer(0);
      setShow(true);
    } else {
      // Restart the timer
      setIsRunning(true);
      setTimer(20 * 60); // Reset timer to 20 minutes
      setShow(false);
      setText(""); // Clear the previous text
      setChange(""); // Clear the input
    }
  };

  const goToNextText = () => {
    if (currentTextIndex < wes.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      setCurrentTextIndex(0);
    }
    setTimer(20 * 60);
    setIsRunning(true);
    setChange("");
    setText("");
    setShow(false);
  };

  const gotTopreviousText = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex(currentTextIndex - 1);
    } else {
      setCurrentTextIndex(wes.length - 1);
    }
    setTimer(20 * 60);
    setIsRunning(true);
    setChange("");
    setText("");
    setShow(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="we-page">
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
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>

      <div className="we-content">
        <Card
          title="Write Essay Exercise"
          timer={<span>{formatTime(timer)}</span>}
          footer={
            <>
              <span className="page-indicator">{currentTextIndex + 1} / {wes.length}</span>
              <div className="navigation-buttons">
                <button className="nav-button" onClick={gotTopreviousText}>Previous</button>
                <button className="nav-button" onClick={goToNextText}>Next</button>
              </div>
            </>
          }
        >
          {wes.length > 0 && (
            <>
              <p className="problem-description">
                You will have 20 minutes to plan, write and revise an essay about the topic below. Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English. You should write 200-300 words.
              </p>
              <p className="question-text">{wes[currentTextIndex].question}</p>
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
              {show ? (
                <p className="suggested-answer">{wes[currentTextIndex].answer}</p>
              ) : (
                <p>Suggested answer comes up here</p>
              )}
              <button className="stop-button" onClick={onStop}>
                {isRunning ? "Stop" : "Start Again"}
              </button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default We;
