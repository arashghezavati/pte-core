import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { ReactMic } from "react-mic";
import axiosInstance from '../../utils/axiosInstance';
import '../reading/commonStyles.css';
import Card from '../Card/Card.tsx';

interface ShortQuestion {
    url: string;
    answer: string;
    audioScript: string;
}

const AnswerShortQuestion: React.FC = () => {
    const [shortQuestions, setShortQuestions] = useState<ShortQuestion[]>([]);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
    const [recording, setRecording] = useState<boolean>(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [timerStart, setTimerStart] = useState<number>(5); // Countdown before starting the audio
    const [timerRecord, setTimerRecord] = useState<number>(10); // Recording countdown
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false); // New state to manage "Start Over" button

    const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to the audio element
    const countdownInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/short");
                setShortQuestions(response.data);
            } catch (error) {
                console.error("Error fetching short questions", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (shortQuestions.length > 0) {
            resetTimers();
            startInitialCountdown();
        }
    }, [currentAudioIndex, shortQuestions]);

    const startInitialCountdown = () => {
        clearExistingInterval();
        countdownInterval.current = setInterval(() => {
            setTimerStart((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval.current!);
                    // Trigger audio to start playing
                    startPlayingAudio();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000); // Set interval to 1000ms for 1 second intervals
    };

    const startPlayingAudio = () => {
        if (audioRef.current) {
            audioRef.current.src = shortQuestions[currentAudioIndex]?.url; // Set the new audio source
            audioRef.current.load(); // Load the new audio file
            audioRef.current.play().catch((error) => {
                console.error("Autoplay was blocked by the browser: ", error);
            });

            audioRef.current.onended = () => {
                startRecordingCountdown(); // Start recording countdown after audio ends
            };
        }
    };

    const startRecordingCountdown = () => {
        clearExistingInterval();
        countdownInterval.current = setInterval(() => {
            setTimerRecord((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval.current!);
                    startRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000); // Set interval to 1000ms for 1 second intervals
    };

    const startRecording = () => {
        setRecording(true);
        setRecordedBlob(null);
        setShowAnswer(false);
        setTimeout(() => {
            stopRecording();
        }, 5000); // Recording for 5 seconds
    };

    const stopRecording = () => {
        setRecording(false);
        setShowAnswer(true); // Display answer and audioScript after recording ends
        setIsCompleted(true); // Set isCompleted to true when the recording ends
    };

    const handleStop = () => {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause(); // Pause the audio if it's playing
        }
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
        }
        stopRecording();
    };

    const startOver = () => {
        // Reset the state and re-trigger the countdown and audio
        setIsCompleted(false);
        resetTimers();
        startInitialCountdown(); // Restart the countdown and audio as if the page is reloaded
    };

    const goToNextAudio = () => {
        handleStop(); // Stop any ongoing playback or timers before proceeding
        if (currentAudioIndex < shortQuestions.length - 1) {
            setCurrentAudioIndex(currentAudioIndex + 1);
        } else {
            setCurrentAudioIndex(0);
        }
        setIsCompleted(false); // Reset the state when moving to the next question
    };

    const goToPreviousAudio = () => {
        handleStop(); // Stop any ongoing playback or timers before proceeding
        if (currentAudioIndex > 0) {
            setCurrentAudioIndex(currentAudioIndex - 1);
        } else {
            setCurrentAudioIndex(shortQuestions.length - 1);
        }
        setIsCompleted(false); // Reset the state when moving to the previous question
    };

    const resetTimers = () => {
        setTimerStart(5);
        setTimerRecord(10); // Make sure recording time is reset to 10 seconds
        setRecording(false);
        setShowAnswer(false);
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
           
           title={`Question ${currentAudioIndex + 1}`}
           timer={<span>Beginning in: {timerRecord > 0 ? timerRecord : 0} / Starts in: {timerStart > 0 ? timerStart : 0}</span>}
     
           footer={
             <div className="navigation-footer">
               <span className="page-indicator">Page {currentAudioIndex + 1} / {shortQuestions.length}</span>
               <div className="navigation-buttons">
                 <button className="nav-button" onClick={goToPreviousAudio}>Previous</button>
                 <button className="nav-button" onClick={goToNextAudio}>Next</button>
               </div>
             </div>
           }
           >
            {shortQuestions.length > 0 && (
                <>
                    <h1>You will hear a question. Please give a simple and short answer. Often just one or a few words is enough.</h1>
                    

                    {showAnswer && (
                        <>
                            <p><strong>Answer:</strong> {shortQuestions[currentAudioIndex]?.answer}</p>
                            <p><strong>Audio Script:</strong> {shortQuestions[currentAudioIndex]?.audioScript}</p>
                        </>
                    )}
                    <div className='audios'>
  {/* HTML5 Audio Player */}
  <audio ref={audioRef} controls>
                        <source src={shortQuestions[currentAudioIndex]?.url} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>

                    <ReactMic
                        record={recording}
                        className="sound-wave"
                        onStop={(recordedBlob) => setRecordedBlob(recordedBlob)}
                        strokeColor="#000000"
                        backgroundColor="#FF4081"
                    />

                    {/* Conditionally render Stop or Start Over button */}
                    {!isCompleted ? (
                        <button onClick={handleStop}>Stop</button>
                    ) : (
                        <button onClick={startOver}>Start Over</button>
                    )}
                    </div>
                  
                </>
            )}
         </Card> 
        </div>
    );
};

export default AnswerShortQuestion;
