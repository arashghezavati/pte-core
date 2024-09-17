import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './Mc.css';
import { Link } from 'react-router-dom';

interface McQuestion {
  text: string;
  audioUrl: string;
  options: { text: string; _id: number }[];
  correctAnswers: number[];
}

const Mc: React.FC = () => {
  const [mcs, setMcs] = useState<McQuestion[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [audio] = useState<HTMLAudioElement>(new Audio());
  const [audioTimer, setAudioTimer] = useState<number>(5);
  const [answerTimer, setAnswerTimer] = useState<number>(10);
  const [readyToPlay, setReadyToPlay] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/mc");
        setMcs(response.data);
      } catch (error) {
        console.error("Error fetching MC data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (audioTimer > 0) {
      const timer = setTimeout(() => setAudioTimer(audioTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (audioTimer === 0 && readyToPlay) {
      audio.play().catch(error => console.log("Audio play failed:", error));
    }
  }, [audioTimer, readyToPlay, audio]);

  useEffect(() => {
    if (audioTimer === 0 && answerTimer > 0 && !submitted) {
      const timer = setTimeout(() => setAnswerTimer(answerTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (answerTimer === 0 && !submitted) {
      handleSubmit();
    }
  }, [audioTimer, answerTimer, submitted]);

  useEffect(() => {
    if (mcs.length > 0) {
      handleStart(); // Automatically start the timers when the question is loaded
    }
  }, [mcs, current]);

  const handleOptionSelect = (id: number) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(option => option !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleStart = () => {
    setAudioTimer(5);
    setAnswerTimer(10);
    setReadyToPlay(true);
    setSubmitted(false);
    setSelectedOptions([]);
    audio.src = mcs[current]?.audioUrl || "";
    audio.load(); // Ensure the audio is loaded
  };

  const handleStop = () => {
    setAudioTimer(0);
    setAnswerTimer(0);
    audio.pause();
    handleSubmit();
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (current < mcs.length - 1) {
      setCurrent(current + 1);
      handleStart();
    } else {
      console.log("End of questions");
    }
  };

  const handlePreviousQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      handleStart();
    } else {
      console.log("No previous questions");
    }
  };

  if (!mcs.length) return <div>Loading...</div>;

  const { text, options, correctAnswers } = mcs[current];

  return (
    <div className="mc-page">
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

      <Card
        title={`Multiple Choice Exercise`}
        timer={
          <span>{audioTimer} | {answerTimer}</span>
        }
        footer={
          <div className="navigation-footer">
            <span className="page-indicator">Page {current + 1} / {mcs.length}</span>
            <div className="navigation-buttons">
              <button className="nav-button" onClick={handlePreviousQuestion}>Previous</button>
              <button className="nav-button" onClick={handleNextQuestion}>Next</button>
            </div>
          </div>
        }
      >
        <div className="mc-container">
          <p>Listen to the recording and answer the question by selecting all the correct responses. You may need to select more than one response.</p>
          <h1>{text}</h1>
          {audioTimer > 0 ? (
            <div>Audio will start in {audioTimer} seconds</div>
          ) : (
            <audio controls src={audio.src} autoPlay />
          )}
          <ul className="options-list">
            {options.map(option => (
              <li
                key={option._id}
                style={{
                  cursor: 'pointer',
                  backgroundColor: submitted
                    ? (correctAnswers.includes(option._id) ? 'lightgreen' : 'lightcoral')
                    : '',
                  border: selectedOptions.includes(option._id) ? '2px solid blue' : 'none'
                }}
                onClick={() => !submitted && handleOptionSelect(option._id)}
              >
                {option.text}
              </li>
            ))}
          </ul>
          {!submitted ? (
            <>
              <div>Submit in {answerTimer} seconds</div>
              <button className="stop-button" onClick={handleStop}>Stop</button>
            </>
          ) : (
            <div>
              <button className="start-button" onClick={handleStart}>Start Again</button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Mc;
