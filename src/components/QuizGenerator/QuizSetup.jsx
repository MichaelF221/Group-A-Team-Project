// src/components/QuizGenerator/QuizSetup.jsx
import React, { useState } from 'react';
import './QuizGenerator.css';

const QuizSetup = ({ onGenerate }) => {
  const [config, setConfig] = useState({
    topic: '',
    numQuestions: 10,
    difficulty: 'medium',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!config.topic.trim()) {
      newErrors.topic = 'Quiz topic is required';
    }
    if (config.numQuestions < 1 || config.numQuestions > 50) {
      newErrors.numQuestions = 'Number of questions must be between 1 and 50';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate(config);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: name === 'numQuestions' ? parseInt(value) : value
    }));
  };

  return (
    <div className="quiz-setup-container">
      <div className="setup-header">
        <h1>Quiz Setup</h1>
        <p>Configure your quiz settings below</p>
      </div>

      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label>Quiz Topic</label>
          <input
            type="text"
            name="topic"
            value={config.topic}
            onChange={handleChange}
            placeholder="e.g., World History, JavaScript, Biology"
            className={errors.topic ? 'error' : ''}
          />
          {errors.topic && <span className="error-text">{errors.topic}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Difficulty Level</label>
            <select
              name="difficulty"
              value={config.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Questions</label>
            <input
              type="number"
              name="numQuestions"
              value={config.numQuestions}
              onChange={handleChange}
              min="1"
              max="50"
              className={errors.numQuestions ? 'error' : ''}
            />
            {errors.numQuestions && <span className="error-text">{errors.numQuestions}</span>}
            <small className="helper-text">Choose between 1 and 50 questions</small>
          </div>
        </div>

        <button type="submit" className="generate-btn">
          Generate Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;