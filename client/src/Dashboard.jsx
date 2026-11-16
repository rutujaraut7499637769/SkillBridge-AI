import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  ChartNoAxesColumn,
  Brain,
  Map,
  ClipboardList,
  TrendingUp,
  UserRound,
  LogOut,
  ArrowRight,
  Target,
  Award,
  Bot
} from "lucide-react";

import "./Dashboard.css";

function Dashboard({
  onSkillAssessment,
  onMySkills,
  onLearningRoadmap,
  onQuiz,
  onProgress,
  onProfile,
  onLogout,
  onChatbot
}) {
  const [assessments, setAssessments] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    fetchAssessments();
    fetchProfile();
    fetchQuizResults();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${API_URL}/api/assessment/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAssessments(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.log("Error fetching assessments:", error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${API_URL}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data.user);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  const fetchQuizResults = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${API_URL}/api/quiz/results`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuizResults(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.log("Error fetching quiz results:", error);
      setQuizResults([]);
    }
  };

  const latestAssessment =
    assessments.length > 0 ? assessments[0] : null;

  const overallProgress =
    assessments.length > 0
      ? Math.round(
          assessments.reduce(
            (total, assessment) =>
              total + (Number(assessment.percentage) || 0),
            0
          ) / assessments.length
        )
      : 0;

  const getNextLearning = (assessment) => {
    const skill = assessment.skill?.toLowerCase();
    const score = Number(assessment.percentage) || 0;

    const topics = {
      javascript: {
        weak: "JavaScript Basics → Functions → Arrays",
        average: "DOM → ES6 → Async JavaScript",
        strong: "Advanced JavaScript → APIs → Real Project"
      },
      react: {
        weak: "Components → Props → State",
        average: "Hooks → API Integration → Component Design",
        strong: "Advanced Hooks → Performance → Real Project"
      },
      html: {
        weak: "HTML Basics → Semantic HTML → Forms",
        average: "Accessibility → SEO → Responsive HTML",
        strong: "Advanced Accessibility → SEO → Professional Website"
      },
      css: {
        weak: "CSS Basics → Flexbox → Responsive Design",
        average: "Grid → Advanced Flexbox → Responsive UI",
        strong: "Animations → Advanced CSS → Professional UI"
      },
      node: {
        weak: "Node Basics → Express → REST API",
        average: "Middleware → Authentication → API Integration",
        strong: "JWT → API Security → Production API"
      },
      sql: {
        weak: "SQL Basics → SELECT → Filtering",
        average: "Joins → Subqueries → Database Design",
        strong: "Advanced SQL → Optimization → Database Project"
      }
    };

    const selectedSkill = topics[skill];

    if (!selectedSkill) {
      if (score < 60) {
        return "Learn the basics → Core concepts → Practice Quiz";
      }
      if (score < 80) {
        return "Intermediate concepts → Practice → Small Project";
      }
      return "Advanced concepts → Real-world problems → Advanced Project";
    }

    if (score < 60) return selectedSkill.weak;
    if (score < 80) return selectedSkill.average;

    return selectedSkill.strong;
  };

  const getJobRecommendation = () => {
    const skills = assessments.map(
      item => item.skill?.toLowerCase()
    );

    if (skills.some(skill => skill?.includes("react"))) {
      return {
        role: "Frontend Developer",
        description:
          "Improve React, JavaScript, HTML and CSS. Build responsive projects.",
        skills: "React • JavaScript • HTML • CSS"
      };
    }

    if (skills.some(skill => skill?.includes("node"))) {
      return {
        role: "Backend Developer",
        description:
          "Focus on Node.js, Express, REST APIs and database management.",
        skills: "Node.js • Express • MongoDB • APIs"
      };
    }

    if (skills.some(skill => skill?.includes("sql"))) {
      return {
        role: "SQL / Database Developer",
        description:
          "Practice SQL queries, joins, database design and optimization.",
        skills: "SQL • Database Design • Queries"
      };
    }

    if (skills.some(skill => skill?.includes("javascript"))) {
      return {
        role: "JavaScript Developer",
        description:
          "Strengthen JavaScript fundamentals, DOM, ES6 and API integration.",
        skills: "JavaScript • DOM • ES6 • APIs"
      };
    }

    return {
      role: "Junior Web Developer",
      description:
        "Start with HTML, CSS and JavaScript, then build practical web projects.",
      skills: "HTML • CSS • JavaScript"
    };
  };

  const profileImage = user?.profileImage
    ? `${API_URL}${user.profileImage}`
    : null;

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const jobRecommendation = getJobRecommendation();

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-logo">SB</div>
          <h2>SkillBridge AI</h2>
        </div>

        <nav className="sidebar-menu">

          <button className="menu-item active">
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="menu-item"
            onClick={onSkillAssessment}
          >
            <ChartNoAxesColumn size={19} />
            Skill Assessment
          </button>

          <button
            className="menu-item"
            onClick={onMySkills}
          >
            <Brain size={19} />
            My Skills
          </button>

          <button
            className="menu-item"
            onClick={() =>
              onLearningRoadmap(latestAssessment?.skill || "")
            }
          >
            <Map size={19} />
            Learning Roadmap
          </button>

          <button
            className="menu-item"
            onClick={onQuiz}
          >
            <ClipboardList size={19} />
            Quiz
          </button>

          <button
            className="menu-item"
            onClick={onProgress}
          >
            <TrendingUp size={19} />
            Progress
          </button>

          <button
            className="menu-item"
            onClick={onChatbot}
          >
            <Bot size={19} />
            AI Chatbot
          </button>

          <button
            className="menu-item"
            onClick={onProfile}
          >
            <UserRound size={19} />
            Profile
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          <LogOut size={19} />
          Logout
        </button>

      </aside>
      <main className="dashboard-main">

        <div className="dashboard-header">

          <div>
            <h1>
              Welcome back{user?.name ? `, ${user.name}` : ""}!
            </h1>

            <p>
              Continue your personalized learning journey.
            </p>
          </div>

          <div
            className="profile-circle"
            onClick={onProfile}
            title="Open Profile"
            style={{ cursor: "pointer" }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="dashboard-profile-image"
              />
            ) : (
              userInitial
            )}
          </div>

        </div>

        <div className="overview-grid">

          <div className="overview-card">
            <span>
              <TrendingUp size={17} />
              Overall Progress
            </span>

            <h2>
              {loading ? "..." : `${overallProgress}%`}
            </h2>

            <p>
              {assessments.length > 0
                ? "Based on assessed skills"
                : "Start your first assessment"}
            </p>
          </div>

          <div className="overview-card">
            <span>
              <Brain size={17} />
              Skills Assessed
            </span>

            <h2>
              {loading ? "..." : assessments.length}
            </h2>

            <p>
              {assessments.length > 0
                ? "Skill assessments completed"
                : "No assessment completed"}
            </p>
          </div>

          <div className="overview-card">
            <span>
              <Award size={17} />
              Latest Skill Level
            </span>

            <h2>
              {loading ? "..." : latestAssessment?.level || "—"}
            </h2>

            <p>
              {latestAssessment
                ? `${latestAssessment.skill} • ${latestAssessment.percentage}%`
                : "Complete an assessment"}
            </p>
          </div>

        </div>

        <div className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>Skill Performance</h2>
              <p>
                Your latest performance across assessed skills.
              </p>
            </div>
          </div>

          {loading ? (
            <p>Loading assessment results...</p>
          ) : assessments.length === 0 ? (
            <div className="empty-state">
              <h3>No skills assessed yet</h3>

              <p>
                Complete your first skill assessment to see your
                competency level here.
              </p>

              <button
                className="primary-button"
                onClick={onSkillAssessment}
              >
                Start Assessment
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <div className="skills-list">

              {assessments.map(assessment => (
                <div
                  className="skill-row"
                  key={assessment._id}
                >
                  <div className="skill-info">
                    <h3>{assessment.skill}</h3>
                    <span>{assessment.level}</span>
                  </div>

                  <div className="skill-progress">

                    <div className="progress-track">
                      <div
                        className={`skill-progress-fill ${
                          assessment.level?.trim().toLowerCase() === "advanced"
                            ? "advanced"
                            : assessment.level?.trim().toLowerCase() === "strong"
                            ? "strong"
                            : assessment.level?.trim().toLowerCase() === "average"
                            ? "average"
                            : "needs-improvement"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              Number(assessment.percentage) || 0
                            )
                          )}%`
                        }}
                      />
                    </div>

                    <strong>{assessment.percentage}%</strong>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

        <div className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>Quiz Performance</h2>
              <p>
                Your completed quiz results and scores.
              </p>
            </div>
          </div>

          {quizResults.length === 0 ? (
            <div className="empty-state">
              <h3>No quiz completed yet</h3>

              <p>
                Complete a quiz to see your performance here.
              </p>

              <button
                className="primary-button"
                onClick={onQuiz}
              >
                Start Quiz
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <div className="skills-list">

              {quizResults.map(quiz => (
                <div
                  className="skill-row"
                  key={quiz._id}
                >
                  <div className="skill-info">
                    <h3>{quiz.skill}</h3>
                    <span>{quiz.level}</span>

                    <small>
                      {quiz.score}/{quiz.totalQuestions} correct
                    </small>
                  </div>

                  <div className="skill-progress">

                    <div className="progress-track">
                      <div
                        className="skill-progress-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              Number(quiz.percentage) || 0
                            )
                          )}%`
                        }}
                      />
                    </div>

                    <strong>{quiz.percentage}%</strong>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

        <div className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>
                <Target size={21} />
                Improve Your Skills
              </h2>

              <p>
                Identify your strengths, competency gaps and
                build your personalized learning path.
              </p>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={onSkillAssessment}
          >
            Start Skill Assessment
            <ArrowRight size={17} />
          </button>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;