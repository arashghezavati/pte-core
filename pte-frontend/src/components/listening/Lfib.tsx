import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx'; 
import './Lfib.css'; 
import './Lfib.css'; 
import { Link } from 'react-router-dom';
import { FaBook, FaPenFancy, FaMicrophone, FaHeadphones } from 'react-icons/fa';

interface LfibQuestion {
  _id: string;
  title: string;
  audioUrl: string;
  transcriptTemplate: string;
  blanks: Array<{
    position: number;
    correctAnswer: string;
  }>;
}

const Lfib: React.FC = () => {
  const [lfibs, setLfibs] = useState<LfibQuestion[]>([]);
  const [currentExercise, setCurrentExercise] = useState<LfibQuestion | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [audioTimer, setAudioTimer] = useState<number>(5);
  const [answerTimer, setAnswerTimer] = useState<number>(10);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axiosInstance.get('/lfib');
        setLfibs(response.data);
        setCurrentExercise(response.data[0]);
        initializeAnswers(response.data[0]);
        handleStart(); 
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    if (audioTimer > 0) {
      const timer = setTimeout(() => setAudioTimer(audioTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (audioTimer === 0 && audioPlayer) {
      audioPlayer.play().catch(error => console.log('Audio play failed:', error));
    }
  }, [audioTimer, audioPlayer]);

  useEffect(() => {
    if (audioTimer === 0 && answerTimer > 0 && !submitted) {
      const timer = setTimeout(() => setAnswerTimer(answerTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (answerTimer === 0 && !submitted) {
      handleSubmit();
    }
  }, [audioTimer, answerTimer, submitted]);

  const initializeAnswers = (exercise: LfibQuestion) => {
    const answers: { [key: number]: string } = {};
    exercise.blanks.forEach(blank => {
      answers[blank.position] = '';
    });
    setUserAnswers(answers);
  };

  const handleAnswerChange = (position: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [position]: value }));
  };

  const handleStart = () => {
    setAudioTimer(5);
    setAnswerTimer(10);
    setSubmitted(false);
    setUserAnswers(prev => {
      const newAnswers: { [key: number]: string } = {};
      currentExercise?.blanks.forEach(blank => {
        newAnswers[blank.position] = '';
      });
      return newAnswers;
    });
    if (audioPlayer && currentExercise) {
      audioPlayer.src = currentExercise.audioUrl;
    }
  };

  const handleStop = () => {
    setAudioTimer(0);
    setAnswerTimer(0);
    if (audioPlayer) audioPlayer.pause();
    handleSubmit();
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNextExercise = () => {
    if (lfibs.length && currentExercise) {
      const currentIndex = lfibs.findIndex(ex => ex._id === currentExercise._id);
      if (currentIndex < lfibs.length - 1) {
        setCurrentExercise(lfibs[currentIndex + 1]);
        initializeAnswers(lfibs[currentIndex + 1]);
        handleStart();
      }
    }
  };

  const handlePreviousExercise = () => {
    if (lfibs.length && currentExercise) {
      const currentIndex = lfibs.findIndex(ex => ex._id === currentExercise._id);
      if (currentIndex > 0) {
        setCurrentExercise(lfibs[currentIndex - 1]);
        initializeAnswers(lfibs[currentIndex - 1]);
        handleStart();
      }
    }
  };

  if (!currentExercise) return <div>Loading...</div>;

  const currentIndex = lfibs.findIndex(ex => ex._id === currentExercise._id);

  return (
    <div className="lfib-page">
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
        title={currentExercise.title}
        timer={
          <span>{audioTimer} | {answerTimer} Seconds</span>
        }
        footer={
          <div className="navigation-footer">
            <span className="page-indicator">Page {currentIndex + 1} / {lfibs.length}</span>
            <div className="navigation-buttons">
              <button className="nav-button" onClick={handlePreviousExercise}>Previous</button>
              <button className="nav-button" onClick={handleNextExercise}>Next</button>
            </div>
          </div>
        }
      >
        <div className="lfib-container">
          <p>You will hear a recording. Type missing words in the blank.</p>
          <audio
            ref={(ref) => setAudioPlayer(ref)}
            src={currentExercise.audioUrl}
            controls
          />
          <div className="transcript">
            {currentExercise.transcriptTemplate.split(/({\d+})/).map((segment, index) => {
              const match = segment.match(/{(\d+)}/);
              if (match) {
                const position = parseInt(match[1], 10);
                const isCorrect = userAnswers[position] === currentExercise.blanks.find(blank => blank.position === position)?.correctAnswer;
                return (
                  <span key={index}>
                    <input
                      type="text"
                      value={userAnswers[position]}
                      onChange={(e) => handleAnswerChange(position, e.target.value)}
                      disabled={submitted}
                      className="input-box"
                      style={{ backgroundColor: submitted ? (isCorrect ? 'lightgreen' : 'red') : '',width:'100px' } }
                    />
                    {submitted && <span className="feedback" style={{ marginLeft: '8px', fontWeight: 'bold', color: isCorrect ? 'green' : 'red' }}>
                      {isCorrect ? 'Correct!' : `${currentExercise.blanks.find(blank => blank.position === position)?.correctAnswer}`}
                    </span>}
                  </span>
                );
              }
              return <span key={index}>{segment}</span>;
            })}
          </div>
          {!submitted && (
            <button className="stop-button" onClick={handleStop}>Stop</button>
          )}
          {submitted && (
            <button className="start-button" onClick={handleStart}>Start Again</button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Lfib;
