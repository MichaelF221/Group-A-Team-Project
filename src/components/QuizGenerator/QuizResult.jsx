
//QuizResults component for displaying quiz results and explanations.
//Shows score, correct/incorrect answers, and allows retaking or restarting.
import React, { useState } from 'react';
import './QuizGenerator.css';

const QuizResults = ({ quizData, userAnswers, onRestart, onRetake }) => {
  // State for which question explanation is expanded
  const [expandedQuestion, setExpandedQuestion] = useState(null);


//Calculates the user's score and percentage.
//returns Score object with correct, total, and percentage
  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
        correct++;
      }
    });
    return {
      correct,
      total: quizData.questions.length,
      percentage: Math.round((correct / quizData.questions.length) * 100)
    };
  };

  const score = calculateScore();
//sidebar with score summary
  return (
    <div className="quiz-results-container">
      <div className="results-sidebar">
        <div className="results-info">
          <h2>Quiz Results</h2>
          <p className="quiz-topic">{quizData.topic}</p>
        </div>
        
        <div className="score-circle">
          <div className="score-percentage">{score.percentage}%</div>
          <div className="score-label">Score</div>
        </div>
        
        <div className="score-details">
          <p className="score-stats">
            You got {score.correct} out of {score.total} correct
          </p>
        </div>

        <div className="results-actions">
          <button onClick={onRetake} className="action-btn retake-btn">
            Retake Quiz
          </button>
          <button onClick={onRestart} className="action-btn new-btn">
            New Quiz
          </button>
        </div>
      </div>

      <div className="results-main-content">
        <h3>Question Review</h3>
        <div className="questions-list">
          {quizData.questions.map((question, idx) => {
            const isCorrect = userAnswers[idx]?.toLowerCase() === question.correctAnswer.toLowerCase();
            
            return (
              <div 
                key={idx} 
                className={`review-card ${isCorrect ? 'correct' : 'incorrect'}`}
                onClick={() => setExpandedQuestion(expandedQuestion === idx ? null : idx)}
              >
                <div className="review-header">
                  <div className="question-status">
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="question-number">
                    Question {idx + 1}
                  </div>
                  <div className="expand-icon">
                    {expandedQuestion === idx ? '▲' : '▼'}
                  </div>
                </div>
                
                <div className="question-preview">
                  {question.question.length > 100 
                    ? question.question.substring(0, 100) + '...' 
                    : question.question}
                </div>
                
                {expandedQuestion === idx && (
                  <div className="review-details">
                    <div className="answer-row">
                      <span className="answer-label">Your answer:</span>
                      <span className={`your-answer ${!isCorrect ? 'wrong' : ''}`}>
                        {userAnswers[idx] || 'Not answered'}
                      </span>
                    </div>
                    <div className="answer-row">
                      <span className="answer-label">Correct answer:</span>
                      <span className="correct-answer">{question.correctAnswer}</span>
                    </div>
                    <div className="explanation">
                      <span className="answer-label">Explanation:</span>
                      <p>{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;