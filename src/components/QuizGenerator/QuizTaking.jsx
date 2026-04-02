import React, { useState } from 'react';
import './QuizGenerator.css';

const QuizTaking = ({ quizData, onSubmit, onBack }) => {
  // Current question index
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Array of selected answers
  const [answers, setAnswers] = useState([]);

  // Safety check for quiz data
  if (!quizData || !quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading quiz data...</div>;
  }

//Handles selecting an answer for the current question.
  const handleAnswerSelect = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

//Handles moving to next question or submitting quiz.
  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const allAnswered = answers.length === quizData.questions.length && 
                          answers.every(a => a !== undefined && a !== null);
      if (allAnswered) {
        onSubmit(answers);
      } else {
        alert('Please answer all questions before submitting');
      }
    }
  };

  // Get current question and calculate progress
  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
//Sidebar with quiz info and progress
  return (
    <div className="quiz-taking-container">
      <div className="quiz-sidebar">
        <div className="quiz-info">
          <h2 className="quiz-topic-title">Quiz Topic</h2>
          <p className="quiz-topic">{quizData.topic}</p>
        </div>
        
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Progress</span>
            <span className="progress-count">
              {currentQuestion + 1}/{quizData.questions.length}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button onClick={onBack} className="exit-quiz-btn">
          Exit Quiz
        </button>
      </div>

      {/* Main content area with question and options */}
      <div className="quiz-main-content">
        <div className="question-container">
          <h3 className="question-text">{currentQ.question}</h3>
          
          <div className="options-container">
            {currentQ.options.map((option, idx) => (
              <label 
                key={idx} 
                className={`option-item ${answers[currentQuestion] === option ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="question"
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswerSelect(option)}
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <button 
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="nav-btn prev-btn"
          >
            Previous
          </button>
          <button 
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            className="nav-btn next-btn"
          >
            {currentQuestion === quizData.questions.length - 1 ? 'Submit Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;