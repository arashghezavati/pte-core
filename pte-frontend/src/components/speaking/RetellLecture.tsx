import React, { useEffect, useState, useRef } from "react";
import { ReactMic } from "react-mic";
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx'; // Ensure the correct path to your Card component

const RetellLecture: React.FC = () => {
  const [audioUrls, setAudioUrls] = useState<{ url: string; script: string }[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
  const [timer1, setTimer1] = useState<number>(10); // Recording countdown
  const [timer2, setTimer2] = useState<number>(5);  // Countdown before audio starts
  const [recording, setRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false); // For "Start Over"
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Control audio playing state

  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch audio URLs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/retell");
        setAudioUrls(response.data);
      } catch (error) {
        console.error("Error fetching retell data", error);
      }
    };
    fetchData();
  }, []);

  // Reset timers and start countdown when currentAudioIndex changes
  useEffect(() => {
    if (audioUrls.length > 0) {
      resetTimers();
      startInitialCountdown();
    }
  }, [currentAudioIndex, audioUrls]);

  const startInitialCountdown = () => {
    clearExistingInterval();
    countdownInterval.current = setInterval(() => {
      setTimer2((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval.current!);
          startPlayingAudio(); // Start playing the audio after the countdown
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Adjusted for 1 second intervals
  };

  const startPlayingAudio = () => {
    if (audioPlayer.current) {
      audioPlayer.current.pause(); // Pause any currently playing audio
      audioPlayer.current.src = audioUrls[currentAudioIndex]?.url; // Set the new audio source
      audioPlayer.current.load(); // Load the new audio file
      setIsPlaying(true); // Set audio playing state to true

      audioPlayer.current.play().catch((error) => {
        console.error("Autoplay was blocked by the browser:", error);
      });

      // When the audio ends, start recording countdown
      audioPlayer.current.onended = () => {
        setIsPlaying(false);
        startRecordingCountdown();
      };
    }
  };

  const startRecordingCountdown = () => {
    clearExistingInterval();
    countdownInterval.current = setInterval(() => {
      setTimer1((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval.current!);
          startRecording(); // Start recording after the countdown
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Adjusted for 1 second intervals
  };

  const startRecording = () => {
    setRecording(true);
    setRecordedBlob(null);
    setIsCompleted(false); // Mark the flow as not completed yet
    setTimeout(() => {
      stopRecording(); // Stop recording after 10 seconds
    }, 10000);
  };

  const stopRecording = () => {
    setRecording(false);
    setIsCompleted(true); // Mark completion to show "Start Over" button and the script
  };

  const handleStop = () => {
    if (audioPlayer.current && !audioPlayer.current.paused) {
      audioPlayer.current.pause(); // Pause the audio if it's playing
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    stopRecording(); // Trigger stop recording logic
  };

  const startOver = () => {
    setIsCompleted(false);
    resetTimers();
    startInitialCountdown(); // Restart the whole flow
  };

  const goToNextAudio = () => {
    handleStop(); // Stop any ongoing playback or timers before proceeding
    if (currentAudioIndex < audioUrls.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
    } else {
      setCurrentAudioIndex(0);
    }
    setIsCompleted(false);
  };

  const gotTopreviousAudio = () => {
    handleStop(); // Stop any ongoing playback or timers before proceeding
    if (currentAudioIndex > 0) {
      setCurrentAudioIndex(currentAudioIndex - 1);
    } else {
      setCurrentAudioIndex(audioUrls.length - 1);
    }
    setIsCompleted(false);
  };

  const resetTimers = () => {
    setTimer1(10);  // Reset the recording timer
    setTimer2(5);   // Reset the audio starting timer
    setRecording(false);
    setIsPlaying(false); // Reset audio playing state
    clearExistingInterval();
  };

  const clearExistingInterval = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
  };

  return (
    <div className='smw-container'>
      <Card
        title={`Lecture ${currentAudioIndex + 1}`}
        timer={<span>Recording in: {timer1 > 0 ? timer1 : 0} / Starts in: {timer2 > 0 ? timer2 : 0}</span>}
        footer={
          <div className="navigation-footer">
            <span className="page-indicator">Page {currentAudioIndex + 1} / {audioUrls.length}</span>
            <div className="navigation-buttons">
              <button className="nav-button" onClick={gotTopreviousAudio}>Previous</button>
              <button className="nav-button" onClick={goToNextAudio}>Next</button>
            </div>
          </div>
        }
      >
        {audioUrls.length > 0 && (
          <>
            <h1>Retell Lecture</h1>
            <p>You will hear a lecture. After listening to the lecture, in 10 seconds, please speak into the microphone and retell what you have just heard from the lecture in your own words. You will have 40 seconds to give your response.</p>

            <div className='audios'>
              <audio ref={audioPlayer} controls>
                <source src={audioUrls[currentAudioIndex]?.url} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>

              <ReactMic
                record={recording}
                className="sound-wave"
                onStop={(recordedBlob) => setRecordedBlob(recordedBlob)}
                strokeColor="#000000"
                backgroundColor="#FF4081"
              />

              {!isCompleted ? (
                <button onClick={handleStop}>Stop</button>
              ) : (
                <button onClick={startOver}>Start Over</button>
              )}
            </div>

            {/* Show script only after recording or when completed */}
            {isCompleted && (
              <p><strong>Audio Script:</strong> {audioUrls[currentAudioIndex]?.script}</p>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default RetellLecture;
