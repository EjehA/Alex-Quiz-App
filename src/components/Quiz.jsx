import React, { useState, useEffect } from "react";
import axios from "axios";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [feedbackEmoji, setFeedbackEmoji] = useState(null); // Tracks emoji feedback
  const [section, setSection] = useState(1);

  const questionsPerSection = 5; // Define questions per section

  // Fetch questions from an online source
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://opentdb.com/api.php?amount=9&category=10&difficulty=medium&type=multiple"
        );
        const formattedQuestions = response.data.results.map((q) => ({
          question: q.question,
          options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          correctAnswer: q.correct_answer,
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Handle answer selection
  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  // Check answer and proceed
  const checkAnswer = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      setFeedbackEmoji("✅");
    } else {
      setFeedbackEmoji("❌");
      setShowCorrectAnswer(true);
    }

    setTimeout(() => {
      setShowCorrectAnswer(false);
      setFeedbackEmoji(null);
      if (currentQuestion + 1 < questions.length) {
        if ((currentQuestion + 1) % questionsPerSection === 0) {
          setShowResult(true); // Show result for the current section
        } else {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null); // Reset selected answer
        }
      } else {
        setShowResult(true); // Final section result
      }
    }, 2000); // Delay to show the feedback emoji before moving on
  };

  // Restart Quiz Section
  const nextSection = () => {
    setShowResult(false);
    setCurrentQuestion(currentQuestion + 1);
    setSection(section + 1);
    setSelectedAnswer(null);
  };

  return (
    <div>
      {questions.length > 0 ? (
        !showResult ? (
          <div>
            <h2>Section {section}</h2>
            <h3>{questions[currentQuestion].question}</h3>
            <div>
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  style={{
                    backgroundColor: selectedAnswer === option ? "lightblue" : "white",
                  }}
                >
                  {option}
                  {feedbackEmoji && selectedAnswer === option && ` ${feedbackEmoji}`}
                </button>
              ))}
            </div>
            <button onClick={checkAnswer} disabled={!selectedAnswer}>
              Submit Answer
            </button>
            {showCorrectAnswer && (
              <p>
                Correct Answer: <b>{questions[currentQuestion].correctAnswer}</b>
              </p>
            )}
          </div>
        ) : (
          <div>
            <h2>Section {section} Completed!</h2>
            <p>Your score for this section is {score} out of {questionsPerSection}</p>
            <h3>Correct Answers for Section {section}:</h3>
            <ul>
              {questions
                .slice(currentQuestion - questionsPerSection + 1, currentQuestion + 1)
                .map((q, index) => (
                  <li key={index}>
                    <p>
                      Q: {q.question}
                      <br />
                      Correct Answer: <b>{q.correctAnswer}</b>
                    </p>
                  </li>
                ))}
            </ul>
            {currentQuestion + 1 < questions.length ? (
              <button onClick={nextSection}>Next Section</button>
            ) : (
              <p>Quiz Completed! Your total score is {score} out of {questions.length}.</p>
            )}
          </div>
        )
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default Quiz;
