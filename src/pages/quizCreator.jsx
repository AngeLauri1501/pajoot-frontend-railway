import React, { useState } from 'react';

const QuizCreator = () => {
  const [quiz, setQuiz] = useState({
    title: '',
    questions: []
  });

  

  return (
    <div>
      <h2>Quiz Creator</h2>
    </div>
  );
};

export default QuizCreator;
