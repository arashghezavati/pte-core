
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './Sst.css';

const Wfd: React.FC = () => {
  const [ssts, setSsts] = useState<{ url: string; answer: string }[]>([]);
  const [change, setChange] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(5);
  const [timer2, setTimer2] = useState<number>(10);
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
    } else {
      clearInterval(timer1Interval!);
      if (audioPlayer) {
        audioPlayer.play().catch(error => console.error("Audio play failed:", error));
      }
    }

    if (timer2 > 0) {
      timer2Interval = setInterval(() => {
        setTimer2(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer2Interval!);
      setShow(true);
    }

    return () => {
      if (timer1Interval) clearInterval(timer1Interval);
      if (timer2Interval) clearInterval(timer2Interval);
    };
  }, [timer, timer2, audioPlayer]);

  const start = () => {
    setTimer(5);  // Reset to initial values
    setTimer2(10);
    setShow(false);
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
    <Card 
      title="WDF Exercise"
      timer={<span>{timer} / {timer2} seconds</span>}
      footer={
        <>
          <span className="page-indicator">Page {currentIndex + 1} / {ssts.length}</span>
          <div className="navigation-buttons">
            <button onClick={goToPreviousText}>Previous</button>
            <button onClick={goToNextText}>Next</button>
          </div>
        </>
      }
    >
      <p className="instructions">
      You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.
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
      <button className="start-button" onClick={start}>Reset</button>
    </Card>
  );
};

export default Wfd;
