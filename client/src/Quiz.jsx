import { useState } from "react";
import axios from "axios";
import "./Quiz.css";

const quizBank = {
  HTML: [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Text Machine Language",
        "Hyperlink Text Management Language",
        "Home Tool Markup Language"
      ],
      answer: 0
    },
    {
      question: "Which tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      answer: 1
    },
    {
      question: "Which tag is used for the largest heading?",
      options: ["<heading>", "<h6>", "<h1>", "<head>"],
      answer: 2
    },
    {
      question: "Which tag is used to insert an image?",
      options: ["<image>", "<img>", "<src>", "<picture>"],
      answer: 1
    },
    {
      question: "Which attribute specifies the image path?",
      options: ["href", "link", "src", "path"],
      answer: 2
    },
    {
      question: "Which tag creates an unordered list?",
      options: ["<ol>", "<list>", "<ul>", "<li>"],
      answer: 2
    },
    {
      question: "Which tag is used for a paragraph?",
      options: ["<para>", "<p>", "<text>", "<paragraph>"],
      answer: 1
    },
    {
      question: "Which HTML element is used to create a form?",
      options: ["<input>", "<form>", "<fieldset>", "<data>"],
      answer: 1
    },
    {
      question: "Which attribute is used to provide alternative text for an image?",
      options: ["title", "alt", "text", "description"],
      answer: 1
    },
    {
      question: "Which HTML tag is used to create a table row?",
      options: ["<td>", "<th>", "<tr>", "<row>"],
      answer: 2
    }
  ],

  CSS: [
    {
      question: "What does CSS stand for?",
      options: [
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Creative Style System",
        "Colorful Style Sheets"
      ],
      answer: 0
    },
    {
      question: "Which property changes text color?",
      options: ["font-color", "text-color", "color", "foreground"],
      answer: 2
    },
    {
      question: "Which property changes the background color?",
      options: ["background-color", "bgcolor", "background", "color-bg"],
      answer: 0
    },
    {
      question: "Which CSS property controls text size?",
      options: ["font-size", "text-size", "font-style", "size"],
      answer: 0
    },
    {
      question: "Which display value enables Flexbox?",
      options: [
        "display: block",
        "display: flex",
        "display: grid",
        "display: inline"
      ],
      answer: 1
    },
    {
      question: "Which property adds space inside an element?",
      options: ["margin", "padding", "spacing", "border"],
      answer: 1
    },
    {
      question: "Which property adds space outside an element?",
      options: ["padding", "margin", "border", "gap"],
      answer: 1
    },
    {
      question: "Which property makes text bold?",
      options: ["font-weight", "font-bold", "text-bold", "weight"],
      answer: 0
    },
    {
      question: "Which selector targets an element with a specific class?",
      options: ["#class", ".class", "*class", "@class"],
      answer: 1
    },
    {
      question: "Which property is used to round corners?",
      options: [
        "corner-radius",
        "border-radius",
        "radius",
        "round-border"
      ],
      answer: 1
    }
  ],

  JavaScript: [
    {
      question: "Which keyword declares a block-scoped variable?",
      options: ["var", "let", "define", "variable"],
      answer: 1
    },
    {
      question: "Which keyword declares a constant?",
      options: ["constant", "let", "const", "fixed"],
      answer: 2
    },
    {
      question: "Which symbol is used for strict equality?",
      options: ["=", "==", "===", "!="],
      answer: 2
    },
    {
      question: "Which method converts JSON string into a JavaScript object?",
      options: [
        "JSON.parse()",
        "JSON.convert()",
        "JSON.object()",
        "JSON.toObject()"
      ],
      answer: 0
    },
    {
      question: "Which method adds an item to the end of an array?",
      options: ["push()", "add()", "append()", "insert()"],
      answer: 0
    },
    {
      question: "Which method removes the last item from an array?",
      options: ["delete()", "remove()", "pop()", "shift()"],
      answer: 2
    },
    {
      question: "Which function is used to print something in the console?",
      options: ["print()", "console.log()", "log()", "display()"],
      answer: 1
    },
    {
      question: "What type of value is true?",
      options: ["String", "Boolean", "Number", "Object"],
      answer: 1
    },
    {
      question: "Which operator means logical AND?",
      options: ["||", "&&", "!", "&"],
      answer: 1
    },
    {
      question: "Which method creates a new array by transforming each element?",
      options: ["filter()", "map()", "reduce()", "forEach()"],
      answer: 1
    }
  ],

  React: [
    {
      question: "React is mainly used for building what?",
      options: [
        "Databases",
        "User Interfaces",
        "Operating Systems",
        "Servers"
      ],
      answer: 1
    },
    {
      question: "Which function is used to create a React component with state?",
      options: [
        "useState()",
        "useComponent()",
        "state()",
        "createState()"
      ],
      answer: 0
    },
    {
      question: "Which hook is used for side effects?",
      options: [
        "useState",
        "useEffect",
        "useSideEffect",
        "useAction"
      ],
      answer: 1
    },
    {
      question: "What does JSX stand for?",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JavaScript Extension",
        "JSON XML"
      ],
      answer: 0
    },
    {
      question: "Which command is commonly used to create a React project with Vite?",
      options: [
        "npm create vite@latest",
        "npm create react",
        "react new",
        "npm install react-project"
      ],
      answer: 0
    },
    {
      question: "Props are mainly used to do what?",
      options: [
        "Store database data",
        "Pass data between components",
        "Create APIs",
        "Style components"
      ],
      answer: 1
    },
    {
      question: "State in React is used for what?",
      options: [
        "Managing changing component data",
        "Creating databases",
        "Installing packages",
        "Creating CSS files"
      ],
      answer: 0
    },
    {
      question: "Which syntax is used to render JavaScript inside JSX?",
      options: ["[]", "()", "{}", "<>"],
      answer: 2
    },
    {
      question: "What is the purpose of a key when rendering lists?",
      options: [
        "For CSS styling",
        "To identify list elements",
        "For authentication",
        "To connect MongoDB"
      ],
      answer: 1
    },
    {
      question: "Which library is commonly used for routing in React?",
      options: [
        "React Router",
        "React Route CSS",
        "Node Router",
        "Express Router"
      ],
      answer: 0
    }
  ],

  SQL: [
    {
      question: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "System Query Language",
        "Standard Question Language"
      ],
      answer: 0
    },
    {
      question: "Which command retrieves data from a table?",
      options: ["GET", "SELECT", "FETCH", "READ"],
      answer: 1
    },
    {
      question: "Which command is used to add new data?",
      options: ["INSERT", "ADD", "CREATE", "PUT"],
      answer: 0
    },
    {
      question: "Which command modifies existing records?",
      options: ["CHANGE", "MODIFY", "UPDATE", "ALTER"],
      answer: 2
    },
    {
      question: "Which command removes records?",
      options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
      answer: 1
    },
    {
      question: "Which clause filters records?",
      options: ["WHERE", "FILTER", "HAVING", "SELECT"],
      answer: 0
    },
    {
      question: "Which keyword sorts query results?",
      options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE"],
      answer: 1
    },
    {
      question: "Which function counts rows?",
      options: ["TOTAL()", "COUNT()", "NUMBER()", "ROWS()"],
      answer: 1
    },
    {
      question: "Which key uniquely identifies a record?",
      options: [
        "Foreign Key",
        "Primary Key",
        "Secondary Key",
        "Unique Row"
      ],
      answer: 1
    },
    {
      question: "Which command removes an entire table?",
      options: [
        "DELETE TABLE",
        "REMOVE TABLE",
        "DROP TABLE",
        "CLEAR TABLE"
      ],
      answer: 2
    }
  ],

  "Node.js": [
    {
      question: "Node.js is built on which JavaScript engine?",
      options: ["SpiderMonkey", "V8", "JavaScriptCore", "Chakra"],
      answer: 1
    },
    {
      question: "Node.js allows JavaScript to run where?",
      options: [
        "Only in browsers",
        "On the server",
        "Only in databases",
        "Only in CSS"
      ],
      answer: 1
    },
    {
      question: "Which command checks Node.js version?",
      options: ["node check", "node -v", "node version", "npm node"],
      answer: 1
    },
    {
      question: "Which tool manages Node.js packages?",
      options: ["npm", "git", "mongo", "vite"],
      answer: 0
    },
    {
      question: "Which file stores project dependencies?",
      options: [
        "package.json",
        "server.json",
        "node.json",
        "dependency.json"
      ],
      answer: 0
    },
    {
      question: "Which command installs dependencies?",
      options: [
        "npm get",
        "npm install",
        "npm download",
        "npm setup"
      ],
      answer: 1
    },
    {
      question: "Which module is commonly used to create a server?",
      options: ["http", "server", "web", "host"],
      answer: 0
    },
    {
      question: "Node.js uses which programming language?",
      options: ["Python", "Java", "JavaScript", "C++"],
      answer: 2
    },
    {
      question: "What does npm stand for?",
      options: [
        "Node Package Manager",
        "New Programming Module",
        "Node Project Manager",
        "Network Package Manager"
      ],
      answer: 0
    },
    {
      question: "Which command runs a Node.js file?",
      options: [
        "run file.js",
        "node file.js",
        "npm file.js",
        "start node.js"
      ],
      answer: 1
    }
  ],
  "Express.js": [
    {
      question: "Express.js is mainly used for what?",
      options: [
        "Frontend styling",
        "Building web servers and APIs",
        "Database design",
        "Image editing"
      ],
      answer: 1
    },
    {
      question: "Express.js is a framework for which environment?",
      options: ["Python", "Node.js", "Java", "PHP"],
      answer: 1
    },
    {
      question: "Which method handles a GET request?",
      options: [
        "app.get()",
        "app.fetch()",
        "app.request()",
        "app.read()"
      ],
      answer: 0
    },
    {
      question: "Which method handles POST requests?",
      options: [
        "app.send()",
        "app.post()",
        "app.create()",
        "app.add()"
      ],
      answer: 1
    },
    {
      question: "What is middleware?",
      options: [
        "A database",
        "A function that runs during request-response processing",
        "A frontend component",
        "A CSS property"
      ],
      answer: 1
    },
    {
      question: "Which object contains request data?",
      options: ["req", "res", "app", "server"],
      answer: 0
    },
    {
      question: "Which object is used to send a response?",
      options: [
        "req",
        "res",
        "responseData",
        "send"
      ],
      answer: 1
    },
    {
      question: "Which method sends JSON response?",
      options: [
        "res.json()",
        "res.data()",
        "res.sendJSON()",
        "res.object()"
      ],
      answer: 0
    },
    {
      question: "Which package is commonly used for CORS?",
      options: [
        "cors",
        "cross",
        "express-cors-js",
        "access"
      ],
      answer: 0
    },
    {
      question: "Which command installs Express?",
      options: [
        "npm install express",
        "npm get express",
        "node install express",
        "express install"
      ],
      answer: 0
    }
  ],

  MongoDB: [
    {
      question: "MongoDB is what type of database?",
      options: [
        "Relational",
        "Document-oriented NoSQL",
        "Graph",
        "Hierarchical"
      ],
      answer: 1
    },
    {
      question: "MongoDB stores data mainly in what format?",
      options: ["Tables", "Documents", "Rows", "Sheets"],
      answer: 1
    },
    {
      question: "A MongoDB collection is similar to what in SQL?",
      options: ["Database", "Table", "Column", "Query"],
      answer: 1
    },
    {
      question: "A MongoDB document is similar to what?",
      options: ["Row", "Table", "Database", "Column"],
      answer: 0
    },
    {
      question: "Which field uniquely identifies a MongoDB document?",
      options: ["id", "_id", "key", "uid"],
      answer: 1
    },
    {
      question: "Which tool provides a graphical interface for MongoDB?",
      options: [
        "MongoDB Compass",
        "Mongo Viewer",
        "Mongo Studio",
        "Mongo UI"
      ],
      answer: 0
    },
    {
      question: "Which library is commonly used to work with MongoDB in Node.js?",
      options: [
        "Mongoose",
        "MongoNode",
        "MongoConnect",
        "DBJS"
      ],
      answer: 0
    },
    {
      question: "Which operation retrieves documents?",
      options: [
        "find()",
        "get()",
        "select()",
        "read()"
      ],
      answer: 0
    },
    {
      question: "Which operation inserts a document?",
      options: [
        "insertOne()",
        "addRow()",
        "createRow()",
        "putData()"
      ],
      answer: 0
    },
    {
      question: "MongoDB databases are made up of what?",
      options: [
        "Tables only",
        "Collections",
        "Rows",
        "Worksheets"
      ],
      answer: 1
    }
  ],

  Git: [
    {
      question: "Git is mainly used for what?",
      options: [
        "Version control",
        "Database management",
        "Web design",
        "Image editing"
      ],
      answer: 0
    },
    {
      question: "Which command initializes a Git repository?",
      options: [
        "git start",
        "git init",
        "git create",
        "git new"
      ],
      answer: 1
    },
    {
      question: "Which command checks repository status?",
      options: [
        "git check",
        "git status",
        "git state",
        "git info"
      ],
      answer: 1
    },
    {
      question: "Which command stages changes?",
      options: [
        "git stage",
        "git add",
        "git push",
        "git save"
      ],
      answer: 1
    },
    {
      question: "Which command creates a commit?",
      options: [
        "git save",
        "git commit",
        "git record",
        "git store"
      ],
      answer: 1
    },
    {
      question: "Which command uploads commits to a remote repository?",
      options: [
        "git upload",
        "git send",
        "git push",
        "git transfer"
      ],
      answer: 2
    },
    {
      question: "Which command downloads changes from a remote repository?",
      options: [
        "git pull",
        "git download",
        "git fetch-all",
        "git receive"
      ],
      answer: 0
    },
    {
      question: "Which platform commonly hosts Git repositories?",
      options: [
        "GitHub",
        "Google",
        "Chrome",
        "MongoDB"
      ],
      answer: 0
    },
    {
      question: "Which command creates a new branch?",
      options: [
        "git branch branch-name",
        "git new branch-name",
        "git create branch-name",
        "git make branch-name"
      ],
      answer: 0
    },
    {
      question: "What is a commit?",
      options: [
        "A saved snapshot of changes",
        "A database",
        "A programming language",
        "A server"
      ],
      answer: 0
    }
  ],

  "Programming Fundamentals": [
    {
      question: "What is a variable?",
      options: [
        "A storage location for data",
        "A function only",
        "A database",
        "A compiler"
      ],
      answer: 0
    },
    {
      question: "Which structure is used to repeat code?",
      options: [
        "Loop",
        "Variable",
        "Class",
        "Object"
      ],
      answer: 0
    },
    {
      question: "Which loop is commonly used when the number of iterations is known?",
      options: [
        "for",
        "while",
        "do-while",
        "if"
      ],
      answer: 0
    },
    {
      question: "Which statement is used for decision making?",
      options: [
        "if",
        "loop",
        "return",
        "import"
      ],
      answer: 0
    },
    {
      question: "What is an array?",
      options: [
        "A collection of values",
        "A function",
        "A condition",
        "A compiler"
      ],
      answer: 0
    },
    {
      question: "What is a function?",
      options: [
        "A reusable block of code",
        "A database table",
        "A variable type",
        "A programming language"
      ],
      answer: 0
    },
    {
      question: "Which data structure follows LIFO?",
      options: [
        "Queue",
        "Stack",
        "Array",
        "Tree"
      ],
      answer: 1
    },
    {
      question: "Which data structure follows FIFO?",
      options: [
        "Stack",
        "Queue",
        "Tree",
        "Graph"
      ],
      answer: 1
    },
    {
      question: "What does debugging mean?",
      options: [
        "Finding and fixing errors",
        "Writing HTML",
        "Creating databases",
        "Installing software"
      ],
      answer: 0
    },
    {
      question: "What is an algorithm?",
      options: [
        "A step-by-step procedure to solve a problem",
        "A database",
        "A programming language",
        "A computer"
      ],
      answer: 0
    }
  ]
};

/* 
  Each skill has 5 competency areas.
  Every area contains 2 questions.
*/
const topicMap = {
  HTML: [
    "HTML Fundamentals",
    "Links & Images",
    "Lists & Text",
    "Forms",
    "Tables & Accessibility"
  ],
  CSS: [
    "CSS Fundamentals",
    "Colors & Typography",
    "Layout & Flexbox",
    "Spacing",
    "Selectors & Styling"
  ],
  JavaScript: [
    "Variables & Constants",
    "Operators & Data Types",
    "Arrays",
    "Functions & Methods",
    "JavaScript Logic"
  ],
  React: [
    "React Fundamentals",
    "State & Hooks",
    "JSX",
    "Props & Components",
    "Routing & Lists"
  ],
  SQL: [
    "SQL Fundamentals",
    "CRUD Operations",
    "Filtering & Sorting",
    "Functions",
    "Database Keys"
  ],
  "Node.js": [
    "Node.js Fundamentals",
    "NPM & Packages",
    "Project Structure",
    "Server Basics",
    "Node.js Commands"
  ],
  "Express.js": [
    "Express Fundamentals",
    "Routes",
    "Middleware",
    "Request & Response",
    "APIs & CORS"
  ],
  MongoDB: [
    "MongoDB Fundamentals",
    "Documents & Collections",
    "MongoDB Tools",
    "Mongoose",
    "CRUD Operations"
  ],
  Git: [
    "Git Fundamentals",
    "Repository & Status",
    "Staging & Commits",
    "Remote Repositories",
    "Branches & Collaboration"
  ],
  "Programming Fundamentals": [
    "Variables & Data",
    "Conditions",
    "Loops",
    "Functions & Arrays",
    "Problem Solving"
  ]
};

function Quiz({ onBack, onLearningRoadmap }) {
  const skills = Object.keys(quizBank);

  const [selectedSkill, setSelectedSkill] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const questions = selectedSkill
    ? quizBank[selectedSkill]
    : [];

  const handleStartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setSavingResult(false);
    setQuizStarted(true);
  };

  const handleAnswer = (answerIndex) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = answerIndex;

    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (
        answers[index] === question.answer ? 1 : 0
      );
    }, 0);
  };

  const score = calculateScore();

  const percentage =
    questions.length > 0
      ? Math.round((score / questions.length) * 100)
      : 0;

  const getLevel = () => {
    if (percentage >= 80) return "Advanced";
    if (percentage >= 60) return "Strong";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
  };

  const getLevelClass = () => {
    if (percentage >= 80) return "advanced";
    if (percentage >= 60) return "strong";
    if (percentage >= 40) return "average";
    return "needs-improvement";
  };

  const getTopicPerformance = () => {
    const topics = topicMap[selectedSkill] || [];

    return topics.map((topic, topicIndex) => {
      const startIndex = topicIndex * 2;
      const topicQuestions = questions.slice(
        startIndex,
        startIndex + 2
      );

      const topicScore = topicQuestions.reduce(
        (total, question, index) => {
          const actualIndex = startIndex + index;

          return total + (
            answers[actualIndex] === question.answer ? 1 : 0
          );
        },
        0
      );

      const topicPercentage =
        topicQuestions.length > 0
          ? Math.round(
            (topicScore / topicQuestions.length) * 100
          )
          : 0;

      return {
        topic,
        score: topicScore,
        total: topicQuestions.length,
        percentage: topicPercentage
      };
    });
  };

  const topicPerformance = getTopicPerformance();

  const weakTopics = topicPerformance
    .filter((item) => item.percentage < 60)
    .sort((a, b) => a.percentage - b.percentage);

  const strongTopics = topicPerformance
    .filter((item) => item.percentage >= 80)
    .sort((a, b) => b.percentage - a.percentage);

  const getRecommendation = () => {
    if (weakTopics.length > 0) {
      return {
        title: `Focus on ${weakTopics[0].topic}`,
        text: `Your performance shows that ${weakTopics[0].topic} needs more practice. Follow the learning roadmap and strengthen this topic before moving to advanced concepts.`
      };
    }

    if (percentage >= 80) {
      return {
        title: `Explore advanced ${selectedSkill} concepts`,
        text: `You have demonstrated strong knowledge across the tested topics. Continue with advanced concepts and practical projects to improve your real-world skills.`
      };
    }

    if (percentage >= 60) {
      return {
        title: `Strengthen your ${selectedSkill} foundation`,
        text: `You have a good understanding of ${selectedSkill}. Practice the topics where your score is lower and gradually move toward advanced concepts.`
      };
    }

    return {
      title: `Build your ${selectedSkill} fundamentals`,
      text: `Start with the fundamental topics, practice regularly and follow the learning roadmap step by step to improve your competency.`
    };
  };

  const recommendation = getRecommendation();
  const handleSubmitQuiz = async () => {
    if (savingResult) return;

    try {
      setSavingResult(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "https://skillbridge-ai-1-s5wk.onrender.com/skillbridge-ai-1-s5wk.onrender.com//quiz/result",
        {
          skill: selectedSkill,
          score,
          totalQuestions: questions.length,
          percentage,
          level: getLevel(),
          weakTopics: weakTopics.map((item) => ({
            topic: item.topic,
            percentage: item.percentage
          })),
          strongTopics: strongTopics.map((item) => ({
            topic: item.topic,
            percentage: item.percentage
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuizCompleted(true);
    } catch (error) {
      console.error("Quiz result save error:", error);

      alert(
        "Failed to save quiz result. Please try again."
      );
    } finally {
      setSavingResult(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setSavingResult(false);
  };

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">

          <div className="quiz-header">

            <button
              className="quiz-back"
              onClick={onBack}
              aria-label="Back"
            >
              ←
            </button>

            <span className="quiz-label">
              SKILLBRIDGE AI • SKILL PRACTICE
            </span>

            <h1>Test Your Knowledge</h1>

            <p>
              Choose a skill and challenge yourself with a
              competency-focused quiz.
            </p>

          </div>

          <div className="quiz-selection">

            <div className="quiz-selection-header">

              <h2>Select a Skill</h2>

              <p>
                Choose the technology you want to practice.
              </p>

            </div>

            <div className="skill-grid">

              {skills.map((skill) => (
                <button
                  key={skill}
                  className={`skill-option ${selectedSkill === skill
                      ? "selected"
                      : ""
                    }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  <span>{skill}</span>

                  <small>
                    {quizBank[skill].length} Questions
                  </small>
                </button>
              ))}

            </div>

            <button
              className="start-quiz-button"
              disabled={!selectedSkill}
              onClick={handleStartQuiz}
            >
              Start Quiz
            </button>

          </div>

        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-page">

        <div className="quiz-container">

          <div className="quiz-header">

            <button
              className="quiz-back"
              onClick={onBack}
              aria-label="Back"
            >
              ←
            </button>

            <span className="quiz-label">
              SKILLBRIDGE AI • QUIZ RESULT
            </span>

            <h1>Quiz Completed</h1>

            <p>
              Here is your performance for {selectedSkill}.
            </p>

          </div>

          <div className="quiz-result">

            <div className="result-score">
              <span>{percentage}%</span>

              <small>
                Overall Score
              </small>
            </div>

            <div className="result-details">

              <h2>{getLevel()}</h2>

              <p>
                You answered{" "}
                <strong>
                  {score} out of {questions.length}
                </strong>{" "}
                questions correctly.
              </p>

              <div
                className={`result-level ${getLevelClass()}`}
              >
                {getLevel()}
              </div>

              <div className="quiz-recommendation">

                <span className="recommendation-label">
                  PERSONALIZED RECOMMENDATION
                </span>

                <h3>
                  {recommendation.title}
                </h3>

                <p>
                  {recommendation.text}
                </p>

              </div>

            </div>

            <div className="topic-performance-section">

              <div className="topic-section-header">

                <div>
                  <span className="recommendation-label">
                    COMPETENCY ANALYSIS
                  </span>

                  <h3>
                    Topic-wise Performance
                  </h3>

                  <p>
                    Your performance is analyzed across
                    different competency areas.
                  </p>
                </div>

              </div>

              <div className="topic-performance-list">

                {topicPerformance.map((item) => (

                  <div
                    className="topic-performance-card"
                    key={item.topic}
                  >

                    <div className="topic-performance-top">

                      <span>
                        {item.topic}
                      </span>

                      <strong>
                        {item.percentage}%
                      </strong>

                    </div>

                    <div className="topic-progress-bar">

                      <div
                        className={`topic-progress-fill ${item.percentage >= 80
                            ? "topic-strong"
                            : item.percentage >= 60
                              ? "topic-average"
                              : "topic-weak"
                          }`}
                        style={{
                          width: `${item.percentage}%`
                        }}
                      ></div>

                    </div>

                    <small>
                      {item.score} / {item.total} correct
                    </small>

                  </div>

                ))}

              </div>

            </div>

            {weakTopics.length > 0 && (
              <div className="weak-topics-section">

                <div>
                  <span className="recommendation-label">
                    NEEDS ATTENTION
                  </span>

                  <h3>
                    Topics to Improve
                  </h3>
                </div>

                <div className="weak-topic-list">

                  {weakTopics.map((item) => (
                    <div
                      className="weak-topic-item"
                      key={item.topic}
                    >
                      <span>!</span>

                      <div>
                        <strong>
                          {item.topic}
                        </strong>

                        <small>
                          Current score:{" "}
                          {item.percentage}%
                        </small>
                      </div>
                    </div>
                  ))}

                </div>

              </div>
            )}

            {strongTopics.length > 0 && (
              <div className="strong-topics-section">

                <div>
                  <span className="recommendation-label">
                    YOUR STRENGTHS
                  </span>

                  <h3>
                    Strong Competencies
                  </h3>
                </div>

                <div className="strong-topic-list">

                  {strongTopics.map((item) => (
                    <span
                      className="strong-topic-tag"
                      key={item.topic}
                    >
                      ✓ {item.topic}
                    </span>
                  ))}

                </div>

              </div>
            )}

            <div className="result-actions">

              <button
                className="secondary-quiz-button"
                onClick={resetQuiz}
              >
                Choose Another Skill
              </button>

              <button
                className="primary-quiz-button"
                onClick={handleStartQuiz}
              >
                Try Again
              </button>

              <button
                className="primary-quiz-button"
                onClick={() =>
                  onLearningRoadmap(selectedSkill)
                }
              >
                View Learning Roadmap →
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-page">

      <div className="quiz-container">

        <div className="quiz-header">

          <button
            className="quiz-back"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <span className="quiz-label">
            SKILLBRIDGE AI • {selectedSkill.toUpperCase()}
          </span>

          <h1>{selectedSkill} Quiz</h1>

          <p>
            Answer each question carefully to measure your
            current understanding.
          </p>

        </div>

        <div className="quiz-progress-section">

          <div className="quiz-progress-info">

            <span>
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

            <span>
              {Math.round(
                ((currentQuestion + 1) /
                  questions.length) *
                100
              )}
              %
            </span>

          </div>

          <div className="quiz-progress-bar">

            <div
              className="quiz-progress-fill"
              style={{
                width: `${((currentQuestion + 1) /
                    questions.length) *
                  100
                  }%`
              }}
            ></div>

          </div>

        </div>

        <div className="question-card">

          <div className="question-number">
            QUESTION{" "}
            {String(currentQuestion + 1).padStart(2, "0")}
          </div>

          <h2>
            {question.question}
          </h2>

          <div className="answer-options">

            {question.options.map(
              (option, index) => (

                <button
                  key={option}
                  className={`answer-option ${answers[currentQuestion] === index
                      ? "selected"
                      : ""
                    }`}
                  onClick={() =>
                    handleAnswer(index)
                  }
                >

                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="option-text">
                    {option}
                  </span>

                </button>

              )
            )}

          </div>

        </div>

        <div className="quiz-navigation">

          <button
            className="secondary-quiz-button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          <button
            className="primary-quiz-button"
            onClick={handleNext}
            disabled={
              answers[currentQuestion] === undefined ||
              savingResult
            }
          >
            {savingResult
              ? "Saving Result..."
              : currentQuestion ===
                questions.length - 1
                ? "Submit Quiz"
                : "Next Question →"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Quiz;