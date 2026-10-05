import { useState } from "react";
import axios from "axios";

function AssessmentQuestions({ skill, onBack }) {
  const questions = [
    {
      question: `What is the main purpose of ${skill}?`,
      options: [
        "Building and managing software solutions",
        "Only designing images",
        "Only creating documents",
        "Only browsing websites"
      ]
    },
    {
      question: `How would you describe your current ${skill} knowledge?`,
      options: [
        "Beginner",
        "Basic",
        "Intermediate",
        "Advanced"
      ]
    },
    {
      question: `How comfortable are you with practical work using ${skill}?`,
      options: [
        "Not comfortable",
        "Slightly comfortable",
        "Comfortable",
        "Very comfortable"
      ]
    },
    {
      question: `How often have you used ${skill} in a project?`,
      options: [
        "Never",
        "Once or twice",
        "Several times",
        "Frequently"
      ]
    },
    {
      question: `How confident are you in solving problems using ${skill}?`,
      options: [
        "Not confident",
        "Slightly confident",
        "Confident",
        "Very confident"
      ]
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = answer;

    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === undefined) {
      alert("Please select an answer.");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };
const calculateResult = async () => {
  const score = answers.reduce(
    (total, answer) => total + answer,
    0
  );

  const percentage = Math.round(
    (score / (questions.length * 3)) * 100
  );

  let level = "";

  if (percentage >= 75) {
    level = "Strong";
  } else if (percentage >= 50) {
    level = "Average";
  } else {
    level = "Needs Improvement";
  }

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/assessment",
      {
        skill,
        answers,
        score,
        percentage,
        level
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setResult({
      percentage,
      level
    });

  } catch (error) {
    console.log("Assessment save error:", error);

    alert("Assessment result could not be saved.");
  }
};
  

  const question = questions[currentQuestion];

  if (result) {
    return (
      <div className="assessment-page">

        <div className="assessment-header">

          <h1>Assessment Completed 🎉</h1>

          <p>
            Here is your current {skill} skill assessment result.
          </p>

        </div>

        <div className="assessment-card result-card">

          <div className="result-score">
            <span>Your Score</span>

            <h2>{result.percentage}%</h2>
          </div>

          <div className="result-level">
            <span>Skill Level</span>

            <h3>{result.level}</h3>
          </div>

          <div className="result-message">

            <p>
              Your assessment helps SkillBridge AI understand
              your current skill level and identify areas where
              you can improve.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={onBack}
          >
            Back to Skill Assessment
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="assessment-page">

      <div className="assessment-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Assessment
        </button>

        <h1>{skill} Assessment</h1>

        <p>
          Answer the questions honestly to understand
          your current skill level.
        </p>

      </div>

      <div className="assessment-card">

        <div className="question-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <h2>{question.question}</h2>

        <div className="answer-options">

          {question.options.map((option, index) => (

            <button
              key={option}
              className={
                answers[currentQuestion] === index
                  ? "answer-option selected"
                  : "answer-option"
              }
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>

          ))}

        </div>

        <button
          className="primary-button"
          onClick={handleNext}
        >
          {currentQuestion === questions.length - 1
            ? "Submit Assessment"
            : "Next Question"}
        </button>

      </div>

    </div>
  );
}

export default AssessmentQuestions;