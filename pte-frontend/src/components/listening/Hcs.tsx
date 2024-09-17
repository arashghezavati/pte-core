import React, { useEffect, useState } from "react";
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx'; // Ensure the correct path to your Card component
import './Hcs.css'; // Import the shared CSS file

interface McQuestion {
  text: string;
  audioUrl: string;
  options: { text: string; _id: number }[];
  correctAnswer: number;
}

const Hcs: React.FC = () => {
  const [mcs, setMcs] = useState<McQuestion[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement>(new Audio());
  const [audioTimer, setAudioTimer] = useState<number>(5); // Set initial timer value
  const [answerTimer, setAnswerTimer] = useState<number>(10); // Set initial timer value
  const [readyToPlay, setReadyToPlay] = useState<boolean>(false);

  useEffect(() => {
    const fetchMc = async () => {
      try {
        const response = await axiosInstance.get('/hcs');
        setMcs(response.data);
        // handleStart(); // Start the first question automatically
      } catch (error) {
        console.error("Error fetching MC data", error);
      }
    };
    fetchMc();
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
    let timer: NodeJS.Timeout;
    if (audioTimer === 0 && answerTimer > 0 && !submitted) {
      timer = setTimeout(() => setAnswerTimer(answerTimer - 1), 1000);
    } else if (answerTimer === 0 && !submitted) {
      handleSubmit();
    }
    return () => clearTimeout(timer);
  }, [audioTimer, answerTimer, submitted]);

  const handleOptionSelect = (id: number) => {
    setSelectedOptions([id]);
  };
  useEffect(() => {
    if (mcs.length > 0) {
      handleStart(); // Automatically start the timers when the question is loaded
    }
  }, [mcs, current]);
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
    }
  };

  const handlePreviousQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      handleStart();
    }
  };

  if (!mcs.length) return <div>Loading...</div>;

  const { text, options, correctAnswer } = mcs[current];

  return (
    <div className="sst-page">
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
    <Card
      title={`Question ${current + 1}`}
      timer={<span>{audioTimer} / {answerTimer} seconds</span>}

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
      <div className="hcs-container">
        <p>You will hear a recording. Click on the paragraph that best relates to the recording.</p>
        <h1>{text}</h1>
        <audio controls src={audio.src} />
        <ul>
          {options.map(option => {
            const isCorrect = correctAnswer === option._id;
            return (
              <li
                key={option._id}
                style={{
                  cursor: 'pointer',
                  backgroundColor: submitted ? (isCorrect ? 'lightgreen' : 'lightcoral') : '',
                  border: selectedOptions.includes(option._id) ? '2px solid blue' : 'none'
                }}
                onClick={() => !submitted && handleOptionSelect(option._id)}
              >
                {option.text}
              </li>
            );
          })}
        </ul>
        {!submitted ? (
          <div className="button-group">
            <button className="stop-button" onClick={handleStop}>Stop</button>
          </div>
        ) : (
          <div className="button-group">
            <button className="start-button" onClick={handleStart}>Start Again</button>
          </div>
        )}
      </div>
    </Card>
  </div>
  );
};

export default Hcs;
