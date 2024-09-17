import React, { useEffect, useState } from "react";
import { ReactMic } from "react-mic";
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';

interface ImageData {
  url: string;
  keywords: string[];
}

const DescribeImage: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(10); // Initial countdown timer
  const [remainingTime, setRemainingTime] = useState<number | null>(null); // For remaining recording time
  const [recording, setRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showKeywords, setShowKeywords] = useState<boolean>(false); 
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Fetch image data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/image");
        setImageData(response.data); // Update to handle full image data
      } catch (error) {
        console.error("Error fetching image data", error);
      }
    };
    fetchData();
  }, []);

  // Handle timer countdown and start recording when it reaches 0
  useEffect(() => {
    if (timer > 0) {
      const timeOut = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timeOut);
    } else if (timer === 0) {
      startRecording(); // Automatically start recording when the timer reaches 0
    }
  }, [timer]);

  // Start recording and track remaining time during recording
  useEffect(() => {
    if (recording) {
      const totalRecordingTime = 10; // 10 seconds of recording time
      setRemainingTime(totalRecordingTime); // Set initial recording time
      const recordingInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1; // Decrease remaining time
          } else {
            clearInterval(recordingInterval);
            stopRecording();
            return null;
          }
        });
      }, 1000);
      return () => clearInterval(recordingInterval);
    }
  }, [recording]);

  // Reset the timer when the image index changes
  useEffect(() => {
    setTimer(10); 
    setIsCompleted(false); 
    setShowKeywords(false); 
    setRecording(false); 
    setRemainingTime(null); // Reset remaining time when switching images
  }, [currentImageIndex]);

  const goToNextImage = () => {
    if (currentImageIndex < imageData.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
    setIsCompleted(false);
    setShowKeywords(false);
  };

  const gotTopreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(imageData.length - 1);
    }
    setIsCompleted(false);
    setShowKeywords(false);
  };

  // Start recording function
  const startRecording = () => {
    setRecording(true);
    setRecordedBlob(null); 
    setShowKeywords(false);
    setIsCompleted(false); 
  };

  // Stop recording function
  const stopRecording = () => {
    setRecording(false);
    setIsCompleted(true); 
    setShowKeywords(true); 
  };

  // Play the recorded audio
  const playRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };

  // Handle when the recording stops
  const onStop = (recordedBlob) => {
    setRecordedBlob(recordedBlob.blob); 
  };

  const startOver = () => {
    setIsCompleted(false); 
    setTimer(10); 
    setRecording(false); 
    setShowKeywords(false); 
    setRemainingTime(null); // Reset remaining time when starting over
  };

  return (
    <div>
      <Card
        title={`Image ${currentImageIndex + 1}`}
        timer={
          <span>
            Recording starts in: {timer > 0 ? timer : 0} | 
            Remaining time: {remainingTime !== null ? remainingTime : '--'}
          </span>
        }
        footer={
          <div className="navigation-footer">
            <span className="page-indicator">Page {currentImageIndex + 1} / {imageData.length}</span>
            <div className="navigation-buttons">
              <button className="nav-button" onClick={gotTopreviousImage}>Previous</button>
              <button className="nav-button" onClick={goToNextImage}>Next</button>
            </div>
          </div>
        }
      >
        <h1 className="header-title">Look at the picture below. In 25 seconds, please speak into microphone and describe in detail what picture is showing. You will have 40 seconds to give your answer.</h1>
        
        {imageData.length > 0 && (
          <div className="image-section">
            <img src={imageData[currentImageIndex].url} alt="describe image" className="centered-image" />
            {showKeywords && (
              <p className="keywords">Keywords: {imageData[currentImageIndex].keywords.join(', ')}</p>
            )}
          </div>
        )}

        <div className="audio-controls">
          <ReactMic
            record={recording}
            className="sound-wave"
            onStop={onStop}
            strokeColor="#000000"
            backgroundColor="#FF4081"
          />

          <div className="button-group">
            {!isCompleted ? (
              <button onClick={stopRecording}>Stop</button> 
            ) : (
              <button onClick={startOver}>Start Over</button>
            )}
          </div>

          {isCompleted && (
            <button className="play-recording" onClick={playRecording}>Play Recording</button>
          )}
        </div>
      </Card>

      {/* CSS Styles */}
      <style>{`
        .header-title {
          text-align: center;
          font-weight: bold;
        }

        .image-section {
          text-align: center;
        }

        .centered-image {
          display: block;
          margin: 0 auto;
          width: 150px;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .keywords {
          margin-top: 15px;
          font-size: 16px;
          font-weight: bold;
        }

        .audio-controls {
          text-align: center;
          margin-top: 20px;
        }

        .sound-wave {
          width: 40%;
          margin: 0 auto;
          border-radius: 80px;
        }

        .button-group {
          margin-top: 20px;
          display: flex;
          justify-content: center;

        }

        .play-recording {
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default DescribeImage;
