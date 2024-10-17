import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Rop.css';

interface OrderingQuestionData {
  sourceText: string[];
  scrambledText: string[];
}

const Rop: React.FC = () => {
  const [data, setData] = useState<OrderingQuestionData | null>(null);
  const [sourceText, setSourceText] = useState<string[]>([]);
  const [targetText, setTargetText] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedFromSource, setDraggedFromSource] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/rop');
        setData(response.data[0]); // Assuming there's only one document
        setSourceText(response.data[0].scrambledText);
        setTargetText([]); // Initialize target text as empty
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

  const handleDragStart = (e: React.DragEvent, text: string, fromSource: boolean) => {
    setDraggedItem(text);
    setDraggedFromSource(fromSource);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropInSource = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem !== null && draggedFromSource === false) {
      setTargetText((prev) => prev.filter((item) => item !== draggedItem));
      setSourceText((prev) => [...prev, draggedItem]);
      setDraggedItem(null);
      setDraggedFromSource(null);
    }
  };

  const handleDropInTarget = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    if (draggedItem !== null) {
      if (draggedFromSource) {
        setSourceText((prev) => prev.filter((item) => item !== draggedItem));
        
        // Prevent duplication by checking if the item is already in targetText
        if (!targetText.includes(draggedItem)) {
          if (index !== undefined) {
            setTargetText((prev) => [...prev.slice(0, index), draggedItem, ...prev.slice(index)]);
          } else {
            setTargetText((prev) => [...prev, draggedItem]);
          }
        }
      } else {
        const oldIndex = targetText.indexOf(draggedItem);
        if (oldIndex !== -1) {
          setTargetText((prev) => {
            const updatedTargetText = [...prev];
            updatedTargetText.splice(oldIndex, 1); // Remove item from the previous position
            if (index !== undefined) {
              updatedTargetText.splice(index, 0, draggedItem); // Add at the new position
            } else {
              updatedTargetText.push(draggedItem); // Add to the end if no index is provided
            }
            return updatedTargetText;
          });
        }
      }
      setDraggedItem(null);
      setDraggedFromSource(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleStop = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    if (data) {
      setSourceText(data.scrambledText);
      setTargetText([]);
    }
    setShowResults(false);
    setDraggedItem(null);
    setDraggedFromSource(null);
    setTimer(60); // Reset timer to 60 seconds
  };

  const renderTargetText = () => {
    return targetText.map((text, index) => (
      <div
        key={index}
        className={`target-item ${
          showResults ? (text === data!.sourceText[index] ? 'correct' : 'incorrect') : ''
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, text, false)}
        onDrop={(e) => handleDropInTarget(e, index)}
        onDragOver={handleDragOver}
      >
        {text}
      </div>
    ));
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ordering-question-container">
      <div className="timer-card card">
        <div className="timer-content">
          Time left: {timer} seconds
        </div>
      </div>
      <div className="panels">
        <div className="panel card source-panel" onDrop={handleDropInSource} onDragOver={handleDragOver}>
          <div className="panel-header">Source</div>
          {showResults ? (
            <div className="source-container">
              {data.sourceText.map((text, index) => (
                <div key={index} className="source-item correct">{text}</div>
              ))}
            </div>
          ) : (
            <div className="source-container">
              {sourceText.map((text, index) => (
                <div
                  key={index}
                  className="source-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, text, true)}
                >
                  {text}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="panel card target-panel" onDrop={(e) => handleDropInTarget(e)} onDragOver={handleDragOver}>
          <div className="panel-header">Target</div>
          <div className="target-container">{renderTargetText()}</div>
        </div>
      </div>
      <div className="button-group">
        <button onClick={handleStop} className="stop-button">Stop</button>
        <button onClick={handleReset} className="reset-button">Reset</button>
      </div>
    </div>
  );
};

export default Rop;
