//Shows a spinner animation and loading message.
import React from 'react';
import './QuizGenerator.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Generating your quiz questions...</p>
    </div>
  );
};

export default LoadingSpinner;