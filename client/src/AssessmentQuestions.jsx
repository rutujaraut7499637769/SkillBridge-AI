import { useState } from "react";
import axios from "axios";

function AssessmentQuestions({ skill, onBack }) {

  const questionBank = {

    HTML: [
      {
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctAnswer: 1
      },
      {
        question: "Which tag is used to create the largest heading?",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        correctAnswer: 2
      },
      {
        question: "Which HTML element is used to display an image?",
        options: ["<image>", "<img>", "<src>", "<picture>"],
        correctAnswer: 1
      },
      {
        question: "Which attribute is used to specify the URL of a link?",
        options: ["src", "href", "link", "url"],
        correctAnswer: 1
      },
      {
        question: "Which tag is used to create an unordered list?",
        options: ["<ol>", "<list>", "<ul>", "<li>"],
        correctAnswer: 2
      }
    ],

    CSS: [
      {
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Style System",
          "Colorful Style Sheets"
        ],
        correctAnswer: 1
      },
      {
        question: "Which property is used to change text color?",
        options: [
          "text-color",
          "font-color",
          "color",
          "foreground"
        ],
        correctAnswer: 2
      },
      {
        question: "Which property is used to change the background color?",
        options: [
          "background-color",
          "bg-color",
          "color-background",
          "background"
        ],
        correctAnswer: 0
      },
      {
        question: "Which CSS property is used to make an element a flex container?",
        options: [
          "position: flex",
          "display: flex",
          "flex: display",
          "layout: flex"
        ],
        correctAnswer: 1
      },
      {
        question: "Which property is used to control the space inside an element?",
        options: [
          "margin",
          "spacing",
          "padding",
          "border"
        ],
        correctAnswer: 2
      }
    ],

    JavaScript: [
      {
        question: "Which keyword is used to declare a variable that cannot be reassigned?",
        options: ["var", "let", "const", "static"],
        correctAnswer: 2
      },
      {
        question: "Which method is used to add an element to the end of an array?",
        options: ["push()", "add()", "append()", "insert()"],
        correctAnswer: 0
      },
      {
        question: "What is the result of typeof [] in JavaScript?",
        options: ["array", "object", "list", "undefined"],
        correctAnswer: 1
      },
      {
        question: "Which method converts JSON text into a JavaScript object?",
        options: [
          "JSON.parse()",
          "JSON.convert()",
          "JSON.object()",
          "JSON.decode()"
        ],
        correctAnswer: 0
      },
      {
        question: "Which symbol is used for strict equality?",
        options: ["=", "==", "===", "!="],
        correctAnswer: 2
      }
    ],

    React: [
      {
        question: "What is React mainly used for?",
        options: [
          "Building user interfaces",
          "Managing databases",
          "Creating operating systems",
          "Writing SQL queries"
        ],
        correctAnswer: 0
      },
      {
        question: "Which hook is used to manage state in a functional component?",
        options: ["useEffect", "useState", "useFetch", "useComponent"],
        correctAnswer: 1
      },
      {
        question: "Which syntax is commonly used to write HTML-like code in React?",
        options: ["XML", "JSX", "HTMLX", "ReactHTML"],
        correctAnswer: 1
      },
      {
        question: "Which hook is commonly used for side effects?",
        options: ["useState", "useEffect", "useData", "useAction"],
        correctAnswer: 1
      },
      {
        question: "What is a React component?",
        options: [
          "A reusable UI building block",
          "A database table",
          "A CSS file",
          "A backend server"
        ],
        correctAnswer: 0
      }
    ],

    "Node.js": [
      {
        question: "What is Node.js?",
        options: [
          "A JavaScript runtime",
          "A CSS framework",
          "A database",
          "A browser"
        ],
        correctAnswer: 0
      },
      {
        question: "Which command is commonly used to initialize a Node.js project?",
        options: [
          "node start",
          "npm init",
          "node create",
          "npm start-project"
        ],
        correctAnswer: 1
      },
      {
        question: "Which file usually contains Node.js project dependencies?",
        options: [
          "server.js",
          "index.html",
          "package.json",
          "config.json"
        ],
        correctAnswer: 2
      },
      {
        question: "Which command installs a Node.js package?",
        options: [
          "node install package",
          "npm install package",
          "install npm package",
          "node add package"
        ],
        correctAnswer: 1
      },
      {
        question: "Which module system is commonly used in a Node.js CommonJS project?",
        options: [
          "require()",
          "include()",
          "importFile()",
          "load()"
        ],
        correctAnswer: 0
      }
    ],

    "Express.js": [
      {
        question: "What is Express.js?",
        options: [
          "A Node.js web framework",
          "A database",
          "A frontend library",
          "A CSS framework"
        ],
        correctAnswer: 0
      },
      {
        question: "Which method is used to create a GET route in Express?",
        options: [
          "app.fetch()",
          "app.get()",
          "app.routeGet()",
          "express.getRoute()"
        ],
        correctAnswer: 1
      },
      {
        question: "Which middleware is used to parse JSON request bodies?",
        options: [
          "express.json()",
          "express.body()",
          "express.parse()",
          "express.request()"
        ],
        correctAnswer: 0
      },
      {
        question: "What is middleware in Express?",
        options: [
          "A function that runs during the request-response cycle",
          "A database",
          "A frontend component",
          "A CSS file"
        ],
        correctAnswer: 0
      },
      {
        question: "Which object is used to send a response to the client?",
        options: ["req", "request", "res", "responseData"],
        correctAnswer: 2
      }
    ],

    MongoDB: [
      {
        question: "What type of database is MongoDB?",
        options: [
          "Relational database",
          "Document-oriented NoSQL database",
          "Graph database only",
          "Spreadsheet database"
        ],
        correctAnswer: 1
      },
      {
        question: "What format is commonly used to represent MongoDB documents?",
        options: ["HTML", "JSON-like BSON", "CSS", "XML only"],
        correctAnswer: 1
      },
      {
        question: "What is a collection in MongoDB?",
        options: [
          "A group of documents",
          "A single field",
          "A server",
          "A query"
        ],
        correctAnswer: 0
      },
      {
        question: "Which method is commonly used to find documents?",
        options: [
          "find()",
          "search()",
          "getDocuments()",
          "select()"
        ],
        correctAnswer: 0
      },
      {
        question: "Which unique identifier is commonly generated for MongoDB documents?",
        options: [
          "primaryKey",
          "ObjectId",
          "documentKey",
          "mongoIdOnly"
        ],
        correctAnswer: 1
      }
    ],

    SQL: [
      {
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "System Query Logic",
          "Structured Question Language"
        ],
        correctAnswer: 0
      },
      {
        question: "Which command is used to retrieve data from a table?",
        options: ["GET", "SELECT", "FETCH", "READ"],
        correctAnswer: 1
      },
      {
        question: "Which command is used to add a new record?",
        options: ["ADD", "INSERT", "CREATE", "APPEND"],
        correctAnswer: 1
      },
      {
        question: "Which clause is used to filter records?",
        options: ["FILTER", "WHERE", "HAVING ONLY", "SEARCH"],
        correctAnswer: 1
      },
      {
        question: "Which command is used to remove records from a table?",
        options: ["REMOVE", "DELETE", "DROP ROW", "CLEAR"],
        correctAnswer: 1
      }
    ],

    Git: [
      {
        question: "What is Git mainly used for?",
        options: [
          "Version control",
          "Database management",
          "Image editing",
          "Web hosting only"
        ],
        correctAnswer: 0
      },
      {
        question: "Which command is used to create a Git repository?",
        options: [
          "git start",
          "git init",
          "git create",
          "git repository"
        ],
        correctAnswer: 1
      },
      {
        question: "Which command is used to check the current Git status?",
        options: [
          "git check",
          "git status",
          "git current",
          "git state"
        ],
        correctAnswer: 1
      },
      {
        question: "Which command records staged changes in Git history?",
        options: [
          "git save",
          "git record",
          "git commit",
          "git store"
        ],
        correctAnswer: 2
      },
      {
        question: "Which command is commonly used to upload local commits to a remote repository?",
        options: [
          "git upload",
          "git push",
          "git send",
          "git publish"
        ],
        correctAnswer: 1
      }
    ],

    "Programming Fundamentals": [
      {
        question: "What is a variable used for?",
        options: [
          "Storing data",
          "Only printing text",
          "Creating images",
          "Connecting to Wi-Fi"
        ],
        correctAnswer: 0
      },
      {
        question: "Which structure is commonly used to repeat a block of code?",
        options: [
          "Loop",
          "Condition",
          "Variable",
          "Comment"
        ],
        correctAnswer: 0
      },
      {
        question: "Which statement is commonly used to make decisions in a program?",
        options: [
          "if",
          "print",
          "import",
          "return only"
        ],
        correctAnswer: 0
      },
      {
        question: "What is a function?",
        options: [
          "A reusable block of code",
          "A database",
          "A programming language",
          "A file extension"
        ],
        correctAnswer: 0
      },
      {
        question: "What is an algorithm?",
        options: [
          "A step-by-step procedure for solving a problem",
          "A type of database",
          "A programming editor",
          "A computer screen"
        ],
        correctAnswer: 0
      }
    ]

  };

  const questions = questionBank[skill] || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleAnswer = (answerIndex) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = answerIndex;

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

    let score = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    let level = "";

    if (percentage >= 80) {
      level = "Advanced";
    } else if (percentage >= 60) {
      level = "Strong";
    } else if (percentage >= 40) {
      level = "Average";
    } else {
      level = "Needs Improvement";
    }

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "https://skillbridge-ai-1-s5wk.onrender.com/skillbridge-ai-1-s5wk.onrender.com/assessment",
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
        score,
        percentage,
        level
      });

    } catch (error) {

      console.log("Assessment save error:", error);

      alert("Assessment result could not be saved.");
    }
  };

  if (questions.length === 0) {
    return (
      <div className="assessment-page">

        <div className="assessment-card">

          <h2>Assessment unavailable</h2>

          <p>
            Questions for this skill are not available yet.
          </p>

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

            <h2>{result.score} / {questions.length}</h2>

            <strong>{result.percentage}%</strong>

          </div>

          <div className="result-level">

            <span>Skill Level</span>

            <h3>{result.level}</h3>

          </div>

          <div className="result-message">

            <p>
              SkillBridge AI has analyzed your current {skill} knowledge.
              This result will help identify your competency gaps and
              generate personalized learning recommendations.
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
          Answer the questions to evaluate your current {skill} competency.
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