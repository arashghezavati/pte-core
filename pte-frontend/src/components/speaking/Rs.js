import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactMic } from "react-mic";
import axiosInstance from '../../utils/axiosInstance';


const AudioPlayer = () => {
  const [audioUrls, setAudioUrls] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(3);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/audio");
            setAudioUrls(response.data);
        } catch (error) {
            console.error("Error fetching swt data", error);
        }
    };
    fetchData();
}, []);


  useEffect(() => {
    const startTimer = () => {
      if (timer === 0) {
        return;
      }
      const timeout = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    };
    startTimer();
  }, [timer]);

  const recordingAudio = () => {
    setTimeout(() => {
      setRecording(true);
      setTimeout(() => {
        stopRecording();
      }, 5000);
    }, 5000);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const onStop = (recordedBlob) => {
    setRecordedBlob(recordedBlob);
  };

  const start = () => {
    if (
      audioUrls.length > 0 &&
      currentQuestionIndex >= 0 &&
      currentQuestionIndex < audioUrls.length
    ) {
      let audio = new Audio(audioUrls[currentQuestionIndex]);
      audio.play();
      recordingAudio();
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < audioUrls.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const playRecording = () => {
    if (recordedBlob) {
      const audio = new Audio(recordedBlob.blobURL);
      audio.play();
    }
  };

  return (
    <div>
      <p>You will hear a sentence. Please repeat the sentence exactly as you hear it. You will hear the sentence only once.</p>
      <p>Time remaining: {timer}</p>
      {audioUrls.length > 0 && (
        <div>
          <p>Audio {currentQuestionIndex + 1}</p>
          <button onClick={start}>Play</button>
        </div>
      )}
      <button onClick={goToNextQuestion}>Next</button>
      <button onClick={goToPreviousQuestion}>Previous</button>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        // onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />

      <button onClick={playRecording}>play your voice</button>
    </div>
  );
};

export default AudioPlayer;


