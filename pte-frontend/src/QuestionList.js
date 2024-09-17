import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReactMic } from "react-mic";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(5);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const startTimer = () => {
      if (timer === 0) {
        setRecording(true);
        return;
      }
      const timeout = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    };

    startTimer();

    // return () => clearInterval(interval);
  }, [timer]);

  // useEffect(() => {
  //     if (recording) {
  //         setTimeout(() => {
  //             stopRecording();
  //         }, 30000); // 30 seconds
  //     }
  // }, [recording]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const startRecording = () => {
    setRecording(true);
    // setTimer(30); // Reset the timer
    setTimeout(() => {
      stopRecording();
    }, 30000); // 30 seconds
  };

  const stopRecording = () => {
    setRecording(false);
  };

  // const onData = (recordedBlob) => {
  //     console.log('chunk of real-time data is: ', recordedBlob);
  // };

  const onStop = (recordedBlob) => {
    // console.log('recordedBlob is: ', recordedBlob);
    setRecordedBlob(recordedBlob.blob);
  };

  const playRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setTimer(30);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRecording(false); // Stop recording if it's currently recording
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setTimer(30);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setRecording(false); // Stop recording if it's currently recording
    }
  };

  return (
    <div>
      <h1>Read aloud</h1>
      <h2>Look at the text below. in the 30 seconds, you must read it aloud</h2>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        // onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <button onClick={playRecording} disabled={!recordedBlob}>
        Play Recording
      </button>
      <p>Time remaining: {timer} seconds</p>
      {questions.length > 0 && (
        <div>
          <p>{questions[currentQuestionIndex].text}</p>
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;

// ====================================================

//with evaluation =================

// import React, { useState, useEffect } from 'react';
// import { ReactMic } from 'react-mic';

// const QuestionList = () => {
//     const [questions, setQuestions] = useState([]);
//     const [recording, setRecording] = useState(false);
//     const [timer, setTimer] = useState(30);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [evaluationScore, setEvaluationScore] = useState(null);

//     useEffect(() => {
//         let interval;

//         const startTimer = () => {
//             interval = setInterval(() => {
//                 setTimer((prevTimer) => {
//                     if (prevTimer === 1) {
//                         clearInterval(interval);
//                         setRecording(true);
//                     }
//                     return prevTimer - 1;
//                 });
//             }, 1000);
//         };

//         startTimer();

//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         if (recording) {
//             setTimeout(() => {
//                 stopRecording();
//             }, 30000); // 30 seconds
//         }
//     }, [recording]);

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 const response = await fetch('http://localhost:4000/api/questions');
//                 const data = await response.json();
//                 setQuestions(data);
//             } catch (error) {
//                 console.error('Error fetching questions:', error);
//             }
//         };

//         fetchQuestions();
//     }, []);

//     const startRecording = () => {
//         setRecording(true);
//         setTimer(30); // Reset the timer
//         setTimeout(() => {
//             stopRecording();
//         }, 30000); // 30 seconds
//     };

//     const stopRecording = () => {
//         setRecording(false);
//     };

//     const onData = (recordedBlob) => {
//         console.log('chunk of real-time data is: ', recordedBlob);
//     };

//     const onStop = (recordedBlob) => {
//         console.log('recordedBlob is: ', recordedBlob);
//         setRecordedBlob(recordedBlob.blob);
//     };

//     const playRecording = () => {
//         if (recordedBlob) {
//             const url = URL.createObjectURL(recordedBlob);
//             const audio = new Audio(url);
//             audio.play();
//         }
//     };

//     const goToNextQuestion = () => {
//         if (currentQuestionIndex < questions.length - 1) {
//             setTimer(30);
//             setCurrentQuestionIndex(currentQuestionIndex + 1);
//             setRecording(false); // Stop recording if it's currently recording
//         }
//     };

//     const goToPreviousQuestion = () => {
//         if (currentQuestionIndex > 0) {
//             setTimer(30);
//             setCurrentQuestionIndex(currentQuestionIndex - 1);
//             setRecording(false); // Stop recording if it's currently recording
//         }
//     };

//     const evaluateWithAI = async () => {
//         if (recordedBlob) {
//             // Simulate speech recognition by converting the audio blob to text
//             const recognizedText = await recognizeSpeech(recordedBlob);

//             // Compare the recognized text with the current question's text
//             const score = compareTexts(recognizedText, questions[currentQuestionIndex].text);

//             setEvaluationScore(score);
//         }
//     };

//     const recognizeSpeech = (audioBlob) => {
//         // Simulated speech recognition, replace with actual speech recognition library
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 resolve('This is the recognized text'); // Simulated recognized text
//             }, 2000); // Simulated delay
//         });
//     };

//     const compareTexts = (recognizedText, questionText) => {
//         // Simulated text comparison, replace with actual comparison logic
//         return Math.random() * 10; // Return a random score between 0 and 10
//     };

//     return (
//         <div>
//             <h1>Read aloud</h1>
//             <h2>Look at the text below. in the 30 seconds, you must read it aloud</h2>
//             <ReactMic
//                 record={recording}
//                 className="sound-wave"
//                 onStop={onStop}
//                 onData={onData}
//                 strokeColor="#000000"
//                 backgroundColor="#FF4081"
//             />
//             <button onClick={startRecording} disabled={recording}>Start Recording</button>
//             <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
//             <button onClick={playRecording} disabled={!recordedBlob}>Play Recording</button>
//             <button onClick={evaluateWithAI} disabled={!recordedBlob || recording}>Evaluate with AI</button>
//             <p>Time remaining: {timer} seconds</p>
//             {evaluationScore !== null && (
//                 <p>Evaluation Score: {evaluationScore}</p>
//             )}
//             {questions.length > 0 && (
//                 <div>
//                     <p>{questions[currentQuestionIndex].text}</p>
//                     <button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
//                     <button onClick={goToNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QuestionList;
