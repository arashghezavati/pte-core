


import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './commonStyles.css';
import './MultipleChoiceQuestion.css';

interface MultipleChoiceData {
  text: string;
  question: string;
  options: string[];
  correctAnswers: number[];
}

const Mcma: React.FC = () => {
  const [data, setData] = useState<MultipleChoiceData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/mcma');
        setData(response.data[0]); // Assuming there's only one document
      } catch (error) {
        console.error('Error fetching mcma data', error);
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
    setSelectedAnswers((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
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
    setSelectedAnswers([]);
    setShowResults(false);
    setTimer(60);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="multiple-choice-container">
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
              className={`option ${selectedAnswers.includes(index) ? 'selected' : ''} ${showResults && data.correctAnswers.includes(index) ? 'correct' : ''}`}
              onClick={() => handleSelection(index)}
            >
              <input type="checkbox" checked={selectedAnswers.includes(index)} readOnly />
              <span>{option}</span>
            </li>
          ))}
        </ul>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleStop}>Stop</button>
        </div>
       
      </Card>
      <div >
        Question {1} of {1} {/* Update with dynamic values */}
        <div className="navigation-buttons">
          <button onClick={handlePrevious}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Mcma;

