import React from 'react';
import QuizGenerator from '../components/QuizGenerator/QuizGenerator';

const QuizSection = () => {
  return (
    <section className="quiz-section w-full px-6 py-14 flex justify-center bg-linear-to-b from-zinc-900 to-zinc-800">
      <div className="glass rounded-[28px] border border-border/60 p-8 w-full max-w-5xl mx-auto">
        <QuizGenerator />
      </div>
    </section>
  );
};

export default QuizSection;
