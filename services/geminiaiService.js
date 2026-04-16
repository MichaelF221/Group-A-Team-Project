// src/services/openaiService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const generateQuizQuestions = async (topic, numQuestions, difficulty, questionType) => {
  try {
    const response = await fetch(`${API_URL}/api/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        numQuestions,
        difficulty,
        questionType: 'multiple-choice'
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate quiz');
    }
    
    return data.questions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    // Return fallback questions if API fails
    return getFallbackQuestions(topic, numQuestions);
  }
};

// Fallback questions in case API fails
const getFallbackQuestions = (topic, numQuestions) => {
  const fallbackQuestions = [];
  for (let i = 1; i <= Math.min(numQuestions, 5); i++) {
    fallbackQuestions.push({
      id: i,
      question: `What is an important concept of ${topic}? (Demo Question ${i})`,
      options: [
        "Basic understanding",
        "Advanced application",
        "Practical implementation", 
        "Theoretical framework"
      ],
      correctAnswer: "Basic understanding",
      explanation: `This is a demo question. The Gemini API connection failed. Please check that your API key is set in server/.env and the server is running.`
    });
  }
  return fallbackQuestions;
};