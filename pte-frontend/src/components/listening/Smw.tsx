import React, { useState, useEffect } from "react";
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './Smw.css';
import { Link } from 'react-router-dom';
import { FaBook, FaPenFancy, FaMicrophone, FaHeadphones } from 'react-icons/fa';

interface SmwQuestion {
    text: string;
    audioUrl: string;
    options: { text: string, _id: number }[];
    correctAnswer: number;
}

const Csa: React.FC = () => {
    const [smws, setSmws] = useState<SmwQuestion[]>([]);
    const [current, setCurrent] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [audioTimer, setAudioTimer] = useState<number>(5);
    const [answerTimer, setAnswerTimer] = useState<number>(10);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [readyToPlay, setReadyToPlay] = useState<boolean>(false);
    const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/smw");
                setSmws(response.data);
                handleStart();  // Automatically start the first question
            } catch (error) {
                console.error("Error fetching csa data", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (audioTimer > 0) {
            const timer = setTimeout(() => setAudioTimer(audioTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else if (audioTimer === 0 && audioPlayer) {
            audioPlayer.play().catch(error => console.log("Audio play failed", error));
        }
    }, [audioTimer, readyToPlay, audioPlayer]);

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

    const handleStart = () => {
        setAudioTimer(5);
        setAnswerTimer(10);
        setReadyToPlay(true);
        setSubmitted(false);
        setSelectedOptions([]);
        if (audioPlayer && smws[current]) {
            audioPlayer.src = smws[current].audioUrl;
            audioPlayer.load();  // Load the audio to ensure it's ready to play
        }
    };

    const handleStop = () => {
        setAudioTimer(0);
        setAnswerTimer(0);
        handleSubmit();
        if (audioPlayer) {
            audioPlayer.pause();
        }
    };

    const handleNextQuestion = () => {
        if (current < smws.length - 1) {
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

    const handleSubmit = () => {
        setSubmitted(true);
    };

    if (!smws.length) return <div>Loading ...</div>;

    const { text, options, correctAnswer } = smws[current];

    return (
        <div className="csa-page">
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
                title="CSA Exercise"
                timer={
                    <span>{audioTimer} | {answerTimer} Seconds</span>
                }
                footer={
                    <div className="navigation-footer">
                        <span className="page-indicator">Page {current + 1} / {smws.length}</span>
                        <div className="navigation-buttons">
                            <button className="nav-button" onClick={handlePreviousQuestion}>Previous</button>
                            <button className="nav-button" onClick={handleNextQuestion}>Next</button>
                        </div>
                    </div>
                }
            >
                <div className="csa-container">
                    <p> You will hear a recording. At the end of the recording, the last word or
            group of words has been replaced by a beep. Select the correct option to
            complete the recording.</p>
                    <audio
                        ref={(ref) => setAudioPlayer(ref)}
                        src={smws[current]?.audioUrl}
                        controls
                    />
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
                        <button className="start-button" onClick={handleNextQuestion}>Start Again</button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Csa;
