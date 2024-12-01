import React from "react";

const Question = ({ question, onAnswer }) => {
  return (
    <div className="question">
      <h2 dangerouslySetInnerHTML={{ __html: question.question }} />
      <div className="answers">
        {question.answers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(answer)}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ))}
      </div>
    </div>
  );
};

export default Question;
