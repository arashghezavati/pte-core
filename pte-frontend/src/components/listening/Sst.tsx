import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './Sst.css';

const Sst: React.FC = () => {
  const [ssts, setSsts] = useState<{ url: string; answer: string }[]>([]);
  const [change, setChange] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(5);
  const [timer2, setTimer2] = useState<number>(10);
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false); // Track if the audio has played
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/sst");
        setSsts(response.data);
      } catch (error) {
        console.error("Error fetching sst data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let timer1Interval: NodeJS.Timeout | null = null;
    let timer2Interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      timer1Interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (!audioPlayed && audioPlayer) {
      audioPlayer.play().catch(error => console.error("Audio play failed:", error));
      setAudioPlayed(true); // Mark audio as played
    }

    if (timer2 > 0) {
      timer2Interval = setInterval(() => {
        setTimer2(prev => prev - 1);
      }, 1000);
    } else {
      setShow(true);
    }

    return () => {
      if (timer1Interval) clearInterval(timer1Interval);
      if (timer2Interval) clearInterval(timer2Interval);
    };
  }, [timer, timer2, audioPlayer, audioPlayed]);

  const start = () => {
    setTimer(5);  // Reset to initial values
    setTimer2(10);
    setShow(false);
    setAudioPlayed(false); // Reset audio played flag
    if (audioPlayer) {
      audioPlayer.src = ssts[currentIndex]?.url || "";
    }
  };

  const goToNextText = () => {
    if (currentIndex < ssts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    start();
  };

  const goToPreviousText = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(ssts.length - 1);
    }
    start();
  };

  if (ssts.length === 0) return <h1>Loading...</h1>;

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

      <div className="sst-content">
        <Card 
          title="SST Exercise"
          timer={<span>{timer} / {timer2} seconds</span>}
          footer={
            <>
              <span className="page-indicator">Page {currentIndex + 1} / {ssts.length}</span>
              <div className="navigation-buttons">
                <button className="nav-button" onClick={goToPreviousText}>Previous</button>
                <button className="nav-button" onClick={goToNextText}>Next</button>
              </div>
            </>
          }
        >
          <p className="instructions">
            You will hear a short lecture. Write a summary for a fellow student
            who was not present at the lecture. You should write 50-70 words.
            You have 10 minutes to finish this task. Your response will be
            judged on the Quality of Your writing and on how well your response
            presents the key points presented in the lecture.
          </p>
          <audio
            ref={(ref) => setAudioPlayer(ref)}
            src={ssts[currentIndex]?.url}
            controls
          />
          <textarea
            value={change}
            onChange={(e) => setChange(e.target.value)}
            className="input-box"
          />
          {show ? (
            <p className="suggested-answer">{ssts[currentIndex].answer}</p>
          ) : (
            <p>Answer is coming up here</p>
          )}
          <button className="start-button" onClick={start}>Start Again</button>
        </Card>
      </div>
    </div>
  );
};

export default Sst;
