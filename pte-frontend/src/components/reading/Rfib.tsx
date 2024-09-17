import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import styles from './FillInTheBlanks.module.css';

interface FillInTheBlanksData {
  text: string;
  words: string[];
  correctAnswers: number[];
}

const Rfib: React.FC = () => {
  const [questions, setQuestions] = useState<FillInTheBlanksData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/rfib');
        setQuestions(response.data);
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(response.data[0].correctAnswers.length).fill(null));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const timerInterval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(timerInterval);
    } else {
      setShowResults(true);
    }
  }, [timer]);

  useEffect(() => {
    if (questions.length > 0) {
      // Reset the userAnswers whenever the current question changes
      setUserAnswers(new Array(questions[currentQuestionIndex].correctAnswers.length).fill(null));
      setShowResults(false);
      setTimer(60);
    }
  }, [currentQuestionIndex]);

  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData('text/plain', word);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    const newAnswers = [...userAnswers];
    newAnswers[index] = word;
    setUserAnswers(newAnswers);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveWord = (index: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = null;
    setUserAnswers(newAnswers);
  };

  const handleStop = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    setUserAnswers(new Array(questions[currentQuestionIndex].correctAnswers.length).fill(null));
    setShowResults(false);
    setTimer(60);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const renderText = () => {
    const parts = currentQuestion.text.split(/\[BLANK_\d+\]/);
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < userAnswers.length && (
          <span
            className={styles.blank}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            {userAnswers[index] && (
              <span className={styles.filled}>
                {userAnswers[index]}
                <button className={styles.remove} onClick={() => handleRemoveWord(index)}>x</button>
              </span>
            )}
            {!userAnswers[index] && <span className={styles.placeholder}>________</span>}
            {showResults && (
              <span className={`${styles.correct} ${userAnswers[index] !== currentQuestion.words[currentQuestion.correctAnswers[index]] ? styles.incorrect : ''}`}>
                {currentQuestion.words[currentQuestion.correctAnswers[index]]}
              </span>
            )}
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className={styles.fillInTheBlanksContainer}>
      <Card>
        <div className={styles.timers}>
          <h2>Fill in the blanks</h2>
          <div>{timer} seconds</div>
       

        </div>
        <p style={{fontWeight:'bold'}}>In the text below some words are missing. Drag words from the box below to the appropriate place in the text. To undo an answer choice, drag the word back to the box below the text.</p>

        <p>{renderText()}</p>
        
        <div className={styles.wordsContainer}>
          {/* {currentQuestion.words.map((word, index) => (
            <span
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, word)}
            >
              <ul>
                <li style={{listStyle:'none',display:'flex', flexDirection:'row'}}>{word}</li>
              </ul>
             
            </span>
          ))} */}
          <ul style={{ display: 'flex', flexWrap: 'wrap', padding: 0, margin: 0 }}>
  {currentQuestion.words.map((word, index) => (
    <li 
      key={index} 
      style={{
        listStyle: 'none', 
        marginRight: '10px', 
        padding: '10px',
        backgroundColor: '#fff', 
        border: '1px solid #ccc', 
        borderRadius: '4px',
        cursor: 'pointer'
      }} 
      draggable
      onDragStart={(e) => handleDragStart(e, word)}
    >
      {word}
    </li>
  ))}
</ul>

        </div>
        <div className={styles.rfibFooter}>
        <div className={styles.currentQuestionInfo}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className={styles.buttonGroup}>
          <button className={styles.resetButton} onClick={handleReset}>Reset</button>
          <button className={styles.stopButton} onClick={handleStop}>Stop</button>
        </div>
          <div className={styles.navigationButtons}>
            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
            <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
          </div>
          
        </div>
      </Card>
    </div>
  );
};

export default Rfib;
