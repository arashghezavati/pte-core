

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './commonStyles.css';
import './SingleChoiceQuestion.css';

interface SingleChoiceData {
  text: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const Mcaa: React.FC = () => {
  const [data, setData] = useState<SingleChoiceData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/mcaa');
        setData(response.data[0]); // Assuming there's only one document
      } catch (error) {
        console.error('Error fetching mcaa data', error);
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

  const handleSelection = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleStop = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    // Add logic for next question
  };

  const handlePrevious = () => {
    // Add logic for previous question
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResults(false);
    setTimer(60);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single-choice-container">
      <Card>
        <div className="timers">
          <div>Time left: {timer} seconds</div>
        </div>
        <p>{data.text}</p>
        <p><strong>{data.question}</strong></p>
        <ul>
          {data.options.map((option, index) => (
            <li
              key={index}
              className={`option ${selectedAnswer === index ? 'selected' : ''} ${showResults && index === data.correctAnswer ? 'correct' : ''}`}
              onClick={() => handleSelection(index)}
            >
              <input type="radio" name="option" checked={selectedAnswer === index} readOnly />
              <span>{option}</span>
            </li>
          ))}
        </ul>
        <div className="button-group">
          <button className="reset-button" onClick={handleReset}>Reset</button>
          <button className="stop-button" onClick={handleStop}>Stop</button>
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevious}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
      </Card>
      <div className="current-question-info">
        Question 1 of 1 {/* Update with dynamic values */}
      </div>
    </div>
  );
};

export default Mcaa;

