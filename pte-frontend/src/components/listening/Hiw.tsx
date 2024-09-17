import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx'; // Ensure the correct path to your Card component
import './Hiw.css'; // Import Hiw.css

interface IncorrectWord {
  position: number;
  incorrectWord: string;
  correctWord: string;
}

interface HiwData {
  audioUrl: string;
  transcript: string;
  incorrectWords: IncorrectWord[];
}

const Hiw: React.FC = () => {
  const [hiws, setHiws] = useState<HiwData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [firstTimer, setFirstTimer] = useState(5);
  const [secondTimer, setSecondTimer] = useState(90);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isStopped, setIsStopped] = useState(false); // New state to handle button text change
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/hiw");
        setHiws(response.data);
      } catch (error) {
        console.error("Error fetching hiw data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let firstTimerInterval: NodeJS.Timeout | null = null;
    let secondTimerInterval: NodeJS.Timeout | null = null;

    if (firstTimer > 0) {
      firstTimerInterval = setInterval(() => setFirstTimer((prev) => prev - 1), 1000);
    } else if (firstTimer === 0 && !audioPlayed && audioRef.current) {
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
      setAudioPlayed(true);
      setSecondTimer(5); // Ensure the second timer is reset when starting
    }

    if (audioPlayed && secondTimer > 0) {
      secondTimerInterval = setInterval(() => setSecondTimer((prev) => prev - 1), 1000);
    }

    if (secondTimer === 0) {
      setShowResults(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (firstTimerInterval) clearInterval(firstTimerInterval);
      if (secondTimerInterval) clearInterval(secondTimerInterval);
    };
  }, [firstTimer, secondTimer, audioPlayed]);

  const handleWordClick = (index: number) => {
    if (!isStopped) { // Prevent selecting words when stopped
      setSelectedWords((prev) => {
        if (prev.includes(index)) {
          return prev.filter((i) => i !== index);
        } else {
          return [...prev, index];
        }
      });
    }
  };

  const handleStop = () => {
    setShowResults(true);
    setIsStopped(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleStartAgain = () => {
    resetState();
    setIsStopped(false); // Reset to allow interaction again
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % hiws.length);
    resetState();
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + hiws.length) % hiws.length);
    resetState();
  };

  const resetState = () => {
    setSelectedWords([]);
    setShowResults(false);
    setFirstTimer(5);
    setSecondTimer(90);
    setAudioPlayed(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  const renderWord = (word: string, index: number) => {
    let className = '';
    if (selectedWords.includes(index)) {
      className = 'selected';
    }
    if (showResults) {
      const incorrectWord = hiws[currentIndex]?.incorrectWords.find((iw) => iw.position === index);
      if (incorrectWord) {
        className = 'incorrect';
        return (
          <span key={index}>
            <span className={className}>{word}</span>
            <span className="correct">{incorrectWord.correctWord}</span>{' '}
          </span>
        );
      }
    }
    return (
      <span key={index} className={className} onClick={() => handleWordClick(index)}>
        {word}{' '}
      </span>
    );
  };

  if (hiws.length === 0) {
    return <div>Loading...</div>;
  }

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
        title={`Question ${currentIndex + 1} of ${hiws.length}`}
        timer={<span>{firstTimer} / {secondTimer} seconds</span>}
        footer={
          <>
            <span className="page-indicator">Page {currentIndex + 1} / {hiws.length}</span>
            <div className="navigation-buttons">
              <button className="nav-button" onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
              <button className="nav-button" onClick={handleNext}>Next</button>
            </div>
          </>
        }
      >
        <div className="smw-container">
          <p className="instructions">
            You will hear a recording. Below is a transcription of the recording. Some words in the transcription differ from what the speaker(s) said. Please click on the words that are different.
          </p>
          <audio ref={audioRef} src={hiws[currentIndex].audioUrl} controls />
          <p>
            {hiws[currentIndex].transcript.split(' ').map((word, index) => renderWord(word, index))}
          </p>
          <div className="button-group">
            <button className="stop-button" onClick={isStopped ? handleStartAgain : handleStop}>
              {isStopped ? "Start Again" : "Stop"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Hiw;
