// src/components/QuizGenerator/QuizGenerator.jsx
import React, { useState } from 'react';
import QuizSetup from './QuizSetup';
import QuizTaking from './QuizTaking';
import QuizResults from './QuizResult';
import LoadingSpinner from './LoadingSpinner';
import './QuizGenerator.css';

const QuizGenerator = () => {
  const [step, setStep] = useState('setup');
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateQuiz = async (quizConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Generating quiz with config:", quizConfig);
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizConfig.topic,
          numQuestions: quizConfig.numQuestions,
          difficulty: quizConfig.difficulty,
          questionType: 'multiple-choice'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }
      
      console.log("Received questions:", data);
      
      const questions = data.questions || data;
      if (!questions || questions.length === 0) {
        throw new Error("No questions were generated");
      }
      
      setQuizData({
        ...quizConfig,
        questions: questions
      });
      setUserAnswers(new Array(data.length).fill(null));
      setStep('taking');
    } catch (error) {
      console.error("Quiz generation error:", error);
      setError(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = (answers) => {
    setUserAnswers(answers);
    setStep('results');
  };

  const handleRestart = () => {
    setStep('setup');
    setQuizData(null);
    setUserAnswers([]);
    setError(null);
  };

  const handleRetake = () => {
    setStep('taking');
    setUserAnswers(new Array(quizData.questions.length).fill(null));
  };

  return (
    <div className="quiz-generator">
      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {step === 'setup' && !loading && (
        <QuizSetup onGenerate={handleGenerateQuiz} />
      )}

      {step === 'taking' && quizData && (
        <QuizTaking
          quizData={quizData}
          onSubmit={handleSubmitQuiz}
          onBack={handleRestart}
        />
      )}

      {step === 'results' && quizData && (
        <QuizResults
          quizData={quizData}
          userAnswers={userAnswers}
          onRestart={handleRestart}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
};

export default QuizGenerator;