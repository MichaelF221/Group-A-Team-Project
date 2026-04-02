//QuizSetup component for configuring quiz parameters before generation.
//Allows users to set topic, number of questions, and difficulty level.
import React, { useState } from 'react';
import './QuizGenerator.css';

const QuizSetup = ({ onGenerate }) => {
  // State for quiz configuration
  const [config, setConfig] = useState({
    topic: '',
    numQuestions: 10,
    difficulty: 'medium',
  });

  // State for form validation errors
  const [errors, setErrors] = useState({});

  
//Validates the form inputs and sets error messages.
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

//Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate(config);
    }
  };


//Handles input changes and updates config state.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: name === 'numQuestions' ? parseInt(value) : value
    }));
  };
//Header section
  return (
    <div className="quiz-setup-container">
      <div className="setup-header">
        <h1>Quiz Setup</h1>
        <p>Setup your quiz below!</p>
      </div>

      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label>Quiz Topic</label>
          <input
            type="text"
            name="topic"
            value={config.topic}
            onChange={handleChange}
            placeholder="Enter a brief prompt to test yourself!"
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
            <small className="helper-text">Max 50 questions</small>
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