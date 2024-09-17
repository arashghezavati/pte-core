// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './TextWithBlanks.css';
// import axiosInstance from '../../utils/axiosInstance';


// interface Option {
//   blankIndex: number;
//   options: string[];
// }

// interface TextWithBlanksData {
//   text: string;
//   options: Option[];
//   correctAnswers: string[];
// }

// const Rwfib: React.FC = () => {
//   const [data, setData] = useState<TextWithBlanksData[]>([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userSelections, setUserSelections] = useState<string[]>([]);
//   const [showResults, setShowResults] = useState(false);
//   const [timer, setTimer] = useState(60);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const response = await axios.get('http://localhost:4000/api/rwfib');
//   //       setData(response.data);
//   //       setUserSelections(new Array(response.data[0].options.length).fill(''));
//   //     } catch (error) {
//   //       console.log('Error fetching data', error);
//   //     }
//   //   };
//   //   fetchData();
//   // }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get('/rwfib');
//         setData(response.data);
//         if (response.data.length > 0) {
//           setUserSelections(new Array(response.data[0].options.length).fill(''));
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (timer > 0) {
//       const timerInterval = setInterval(() => setTimer(timer - 1), 1000);
//       return () => clearInterval(timerInterval);
//     } else {
//       setShowResults(true);
//     }
//   }, [timer]);

//   const handleSelection = (index: number, value: string) => {
//     const newSelections = [...userSelections];
//     newSelections[index] = value;
//     setUserSelections(newSelections);
//   };

//   const handleStop = () => {
//     setShowResults(true);
//   };

//   const handleNext = () => {
//     setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % data.length);
//     resetState();
//   };

//   const handlePrevious = () => {
//     setCurrentQuestionIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
//     resetState();
//   };

//   const resetState = () => {
//     setUserSelections(new Array(data[currentQuestionIndex].options.length).fill(''));
//     setShowResults(false);
//     setTimer(60);
//   };

//   if (data.length === 0) {
//     return <div>Loading...</div>;
//   }

//   const renderText = () => {
//     const parts = data[currentQuestionIndex].text.split(/(\[BLANK_\d+\])/);
//     let blankIndex = 0;

//     return parts.map((part, index) => {
//       if (part.startsWith('[BLANK_')) {
//         const currentBlankIndex = blankIndex++;
//         return (
//           <span key={index}>
//             <select
//               value={userSelections[currentBlankIndex] || ''}
//               onChange={(e) => handleSelection(currentBlankIndex, e.target.value)}
//               disabled={showResults}
//             >
//               <option value="" disabled>Select...</option>
//               {data[currentQuestionIndex].options[currentBlankIndex].options.map((option, i) => (
//                 <option key={i} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//             {showResults && (
//               <span
//                 className={`result ${
//                   userSelections[currentBlankIndex] === data[currentQuestionIndex].correctAnswers[currentBlankIndex]
//                     ? 'correct'
//                     : 'incorrect'
//                 }`}
//               >
//                 {data[currentQuestionIndex].correctAnswers[currentBlankIndex]}
//               </span>
//             )}
//           </span>
//         );
//       }
//       return part;
//     });
//   };

//   return (
//     <div className="text-with-blanks-container">
//       <div className="timers">
//         <div>Time left: {timer} seconds</div>
//       </div>
//       <p>{renderText()}</p>
//       <button onClick={handleStop}>Stop</button>
//       <div className="navigation-buttons">
//         <button onClick={handlePrevious}>Previous</button>
//         <button onClick={handleNext}>Next</button>
//       </div>
//     </div>
//   );
// };

// export default Rwfib;

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Card from '../Card/Card.tsx';
import './commonStyles.css';
import './TextWithBlanks.css';

interface Option {
  blankIndex: number;
  options: string[];
}

interface TextWithBlanksData {
  text: string;
  options: Option[];
  correctAnswers: string[];
}

const Rwfib: React.FC = () => {
  const [data, setData] = useState<TextWithBlanksData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userSelections, setUserSelections] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/rwfib');
        setData(response.data);
        if (response.data.length > 0) {
          setUserSelections(new Array(response.data[0].options.length).fill(''));
        }
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

  const handleSelection = (index: number, value: string) => {
    const newSelections = [...userSelections];
    newSelections[index] = value;
    setUserSelections(newSelections);
  };

  const handleStop = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % data.length);
    resetState();
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    resetState();
  };

  const handleReset = () => {
    resetState();
  };

  const resetState = () => {
    setUserSelections(new Array(data[currentQuestionIndex].options.length).fill(''));
    setShowResults(false);
    setTimer(60);
  };

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const renderText = () => {
    const parts = data[currentQuestionIndex].text.split(/(\[BLANK_\d+\])/);
    let blankIndex = 0;

    return parts.map((part, index) => {
      if (part.startsWith('[BLANK_')) {
        const currentBlankIndex = blankIndex++;
        return (
          <span key={index}>
            <select
              value={userSelections[currentBlankIndex] || ''}
              onChange={(e) => handleSelection(currentBlankIndex, e.target.value)}
              disabled={showResults}
            >
              <option value="" disabled>Select...</option>
              {data[currentQuestionIndex].options[currentBlankIndex].options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {showResults && (
              <span
                className={`result ${
                  userSelections[currentBlankIndex] === data[currentQuestionIndex].correctAnswers[currentBlankIndex]
                    ? 'correct'
                    : 'incorrect'
                }`}
              >
                {data[currentQuestionIndex].correctAnswers[currentBlankIndex]}
              </span>
            )}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="text-with-blanks-container">
      <Card>
        <div className="timers">
          <div>Time left: {timer} seconds</div>
        </div>
        <p>{renderText()}</p>
        <div className="button-group">
          <button className="reset-button" onClick={handleReset}>Reset</button>
          <button className="stop-button" onClick={handleStop}>Stop</button>
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevious}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
        <div className="current-question">
          Question {currentQuestionIndex + 1} of {data.length}
        </div>
      </Card>
    </div>
  );
};

export default Rwfib;

