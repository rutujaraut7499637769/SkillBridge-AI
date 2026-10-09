import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./LearningRoadmap.css";

function LearningRoadmap({ onBack, selectedSkill }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSkill, setOpenSkill] = useState(null);
  const [completedTopics, setCompletedTopics] = useState({});

  useEffect(() => {
    const savedProgress = localStorage.getItem(
      "skillbridgeCompletedTopics"
    );

    if (savedProgress) {
      setCompletedTopics(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "skillbridgeCompletedTopics",
      JSON.stringify(completedTopics)
    );
  }, [completedTopics]);

  const getTopicStatus = (skill, topicIndex) => {
    const completedCount =
      1 +
      Object.keys(completedTopics).filter((key) =>
        key.startsWith(`${skill}-`)
      ).length;

    if (topicIndex < completedCount) {
      return "completed";
    }

    if (topicIndex === completedCount) {
      return "current";
    }

    return "locked";
  };

  const completeTopic = (skill, topicIndex) => {
    setCompletedTopics((prev) => ({
      ...prev,
      [`${skill}-${topicIndex}`]: true
    }));
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://https://skillbridge-ai-1-s5wk.onrender.com//assessment/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAssessments(response.data);
    } catch (error) {
      console.log("Error fetching roadmap data:", error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const latestSkills = useMemo(() => {
    const uniqueSkills = [];

    assessments.forEach((assessment) => {
      if (
        !uniqueSkills.some(
          (item) => item.skill === assessment.skill
        )
      ) {
        uniqueSkills.push(assessment);
      }
    });

    return uniqueSkills;
  }, [assessments]);

  const getSkillData = (skillName) => {
    return latestSkills.find(
      (item) => item.skill === skillName
    );
  };

  const roadmap = [
    {
      id: 1,
      skill: "HTML",
      title: "HTML & Web Structure",
      description:
        "Build a strong foundation in semantic HTML, forms, tables and modern webpage structure.",
      topics: [
        "Semantic HTML",
        "Forms & Validation",
        "Tables",
        "Accessibility",
        "Page Structure"
      ]
    },
    {
      id: 2,
      skill: "CSS",
      title: "CSS & Responsive Design",
      description:
        "Learn how to create modern, responsive and professional user interfaces.",
      topics: [
        "Selectors & Properties",
        "Flexbox",
        "Grid",
        "Responsive Design",
        "UI Styling"
      ]
    },
    {
      id: 3,
      skill: "JavaScript",
      title: "JavaScript Fundamentals",
      description:
        "Strengthen programming logic and understand the core concepts required for modern frontend development.",
      topics: [
        "Variables & Functions",
        "Arrays & Objects",
        "DOM",
        "ES6",
        "Async JavaScript"
      ]
    },
    {
      id: 4,
      skill: "React",
      title: "React Development",
      description:
        "Build interactive applications using components, state, props, hooks and API integration.",
      topics: [
        "Components",
        "Props & State",
        "Hooks",
        "Routing",
        "API Integration"
      ]
    },
    {
      id: 5,
      skill: "SQL",
      title: "SQL & Database Fundamentals",
      description:
        "Learn how to store, retrieve and manage structured application data efficiently.",
      topics: [
        "Database Basics",
        "SELECT Queries",
        "Joins",
        "CRUD Operations",
        "Database Design"
      ]
    },
    {
      id: 6,
      skill: "Node.js",
      title: "Node.js Backend Development",
      description:
        "Understand server-side JavaScript and build scalable backend applications.",
      topics: [
        "Node.js Basics",
        "Modules",
        "File System",
        "NPM",
        "REST APIs"
      ]
    },
    {
      id: 7,
      skill: "Express.js",
      title: "Express.js & REST APIs",
      description:
        "Create structured backend APIs and connect your frontend with server-side services.",
      topics: [
        "Express Setup",
        "Routes",
        "Middleware",
        "Controllers",
        "REST APIs"
      ]
    },
    {
      id: 8,
      skill: "MongoDB",
      title: "MongoDB & Data Management",
      description:
        "Work with NoSQL databases and manage application data using MongoDB and Mongoose.",
      topics: [
        "MongoDB Basics",
        "Collections",
        "Documents",
        "Mongoose",
        "CRUD"
      ]
    },
    {
      id: 9,
      skill: "Git",
      title: "Git & Version Control",
      description:
        "Learn professional version-control practices for managing and collaborating on projects.",
      topics: [
        "Git Basics",
        "Commits",
        "Branches",
        "GitHub",
        "Project Collaboration"
      ]
    },
    {
      id: 10,
      skill: "Programming Fundamentals",
      title: "Programming & Problem Solving",
      description:
        "Improve logical thinking and strengthen the programming fundamentals needed for interviews.",
      topics: [
        "Variables",
        "Conditions",
        "Loops",
        "Functions",
        "Problem Solving"
      ]
    }
  ];

  const getStatus = (skill) => {
    const data = getSkillData(skill);

    if (!data) {
      return "locked";
    }

    if (data.percentage >= 80) {
      return "completed";
    }

    if (data.percentage >= 60) {
      return "in-progress";
    }

    return "focus";
  };

  const getStatusText = (status) => {
    if (status === "completed") return "Completed";
    if (status === "in-progress") return "In Progress";
    if (status === "focus") return "Focus Area";
    return "Not Assessed";
  };

  const getOverallProgress = () => {
    if (latestSkills.length === 0) return 0;

    return Math.round(
      latestSkills.reduce(
        (total, item) => total + item.percentage,
        0
      ) / latestSkills.length
    );
  };

  if (loading) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-loading">
          <div className="roadmap-spinner"></div>
          <p>Building your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-page">
      <div className="roadmap-container">

        <div className="roadmap-header">

          <button
            className="roadmap-back"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <span className="roadmap-label">
            SKILLBRIDGE AI • PERSONALIZED PATH
          </span>

          <h1>Your Learning Roadmap</h1>

          <p>
            A structured learning path created from your current
            competency profile.
          </p>

        </div>

        <div className="roadmap-overview">

          <div className="overview-content">

            <div>

              <span className="overview-label">
                ROADMAP PROGRESS
              </span>

              <h2>
                {getOverallProgress()}%
              </h2>

              <p>
                Keep improving your skills to unlock the next
                stages of your learning journey.
              </p>

            </div>

            <div className="overview-progress">

              <div className="overview-progress-track">

                <div
                  className="overview-progress-fill"
                  style={{
                    width: `${getOverallProgress()}%`
                  }}
                ></div>

              </div>

              <span>
                {latestSkills.length} skills assessed
              </span>

            </div>

          </div>

        </div>

       
        <div className="roadmap-section">

          <div className="roadmap-section-heading">

            <div>

              <h2>Learning Path</h2>

              <p>
                Follow the stages in order to build your
                full-stack competency.
              </p>

            </div>

            <span>
              {roadmap.length} Stages
            </span>

          </div>

          <div className="roadmap-list">

            {roadmap.map((item, index) => {

              const data = getSkillData(item.skill);
              const status = getStatus(item.skill);

              return (
                <div
                  className={`roadmap-item ${status} ${
                    selectedSkill === item.skill
                      ? "selected-roadmap"
                      : ""
                  }`}
                  key={item.id}
                >

                  <div className="roadmap-marker">

                    <div className="stage-number">

                      {status === "completed"
                        ? "✓"
                        : item.id}

                    </div>

                    {index !== roadmap.length - 1 && (
                      <div className="roadmap-line"></div>
                    )}

                  </div>

            
                  <div className="roadmap-card">

                    <div className="roadmap-card-top">

                      <div>

                        <span className="stage-label">
                          STAGE{" "}
                          {String(item.id).padStart(2, "0")}
                        </span>

                        <h3>
                          {item.title}
                        </h3>

                      </div>

                      <span className="roadmap-status">
                        {getStatusText(status)}
                      </span>

                    </div>

                    <p className="roadmap-description">
                      {item.description}
                    </p>

                    <div className="roadmap-topics">

                      {item.topics.map((topic) => (
                        <span key={topic}>
                          {topic}
                        </span>
                      ))}

                    </div>

                    {data && (
                      <div className="roadmap-skill-result">

                        <div>

                          <span>
                            Current competency
                          </span>

                          <strong>
                            {data.percentage}%
                          </strong>

                        </div>

                        <span className="roadmap-level">
                          {data.level}
                        </span>

                      </div>
                    )}

                   
                    <button
                      className="start-learning-button"
                      onClick={() =>
                        setOpenSkill(
                          openSkill === item.skill
                            ? null
                            : item.skill
                        )
                      }
                    >
                      {openSkill === item.skill
                        ? "Hide Topics ↑"
                        : "Start Learning →"}
                    </button>

                    {openSkill === item.skill && (

                      <div className="learning-topics">

                        <h4>
                          Topics to Learn
                        </h4>

                        {item.topics.map(
                          (topic, topicIndex) => {

                            const topicStatus =
                              getTopicStatus(
                                item.skill,
                                topicIndex
                              );

                            return (
                              <div
                                className={`learning-topic ${topicStatus}`}
                                key={topic}
                              >

                                <span>
                                  {topicStatus === "completed"
                                    ? "✓"
                                    : topicStatus === "current"
                                    ? "→"
                                    : "🔒"}
                                </span>

                                <p>
                                  {topic}
                                </p>

                                <small>
                                  {topicStatus === "completed"
                                    ? "Completed"
                                    : topicStatus === "current"
                                    ? "Current"
                                    : "Locked"}
                                </small>

                                {topicStatus === "current" && (
                                  <button
                                    className="complete-topic-button"
                                    onClick={() =>
                                      completeTopic(
                                        item.skill,
                                        topicIndex
                                      )
                                    }
                                  >
                                    Mark as Complete ✓
                                  </button>
                                )}

                              </div>
                            );
                          }
                        )}

                      </div>

                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

    
        <div className="roadmap-ai-note">

          <div className="ai-note-icon">
            ✦
          </div>

          <div>

            <span>
              AI-POWERED PERSONALIZATION
            </span>

            <h3>
              Your roadmap will become smarter
            </h3>

            <p>
              SkillBridge AI will analyze your competency gaps,
              assessment history and learning performance to
              automatically prioritize the topics you need most.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default LearningRoadmap;