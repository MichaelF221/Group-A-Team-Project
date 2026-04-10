import React, { useState } from 'react';
import QuizSetup from './QuizSetup';
import QuizTaking from './QuizTaking';
import QuizResults from './QuizResult';
import LoadingSpinner from './LoadingSpinner';
import './QuizGenerator.css';

const QuizGenerator = () => {
  // State for current step in quiz process: 'setup', 'taking', 'results'
  const [step, setStep] = useState('setup');
  // Stores the generated quiz data including questions
  const [quizData, setQuizData] = useState(null);
  // Array of user's answers to quiz questions
  const [userAnswers, setUserAnswers] = useState([]);
  // Loading state during quiz generation
  const [loading, setLoading] = useState(false);
  // Error message if quiz generation fails
  const [error, setError] = useState(null);

  
  const handleGenerateQuiz = async (quizConfig) => {
    setLoading(true);
    setError(null);
    
    try {
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
      
      const questions = data.questions || data;
      if (!questions || questions.length === 0) {
        throw new Error("No questions were generated");
      }
      
      setQuizData({
        ...quizConfig,
        questions: questions
      });
      setUserAnswers(new Array(questions.length).fill(null));
      setStep('taking');
    } catch (error) {
      setError(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmitQuiz = (answers) => {
    setUserAnswers(answers);
    setStep('results');
  };


//Resets the quiz to setup step and clears all data.
  const handleRestart = () => {
    setStep('setup');
    setQuizData(null);
    setUserAnswers([]);
    setError(null);
  };

  
//Handles retaking the quiz by resetting answers and going back to taking step.
  const handleRetake = () => {
    setStep('taking');
    setUserAnswers(new Array(quizData.questions.length).fill(null));
  };

  return (
    <div className="quiz-generator">
      {/* Show loading spinner during quiz generation */}
      {loading && <LoadingSpinner />}

      {/* Display error message if generation failed */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Quiz setup form */}
      {step === 'setup' && !loading && (
        <QuizSetup onGenerate={handleGenerateQuiz} />
      )}

      {/* Quiz taking interface shown after generation */}
      {step === 'taking' && quizData && (
        <QuizTaking
          quizData={quizData}
          onSubmit={handleSubmitQuiz}
          onBack={handleRestart}
        />
      )}

      {/* Quiz results - shown after submission */}
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