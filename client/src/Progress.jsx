import { useEffect, useState } from "react";
import axios from "axios";
// import "./Progress.css";

function Progress({ onBack }) {
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
    activityDates: []
  });

  const [assessments, setAssessments] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [
        streakResponse,
        assessmentResponse,
        quizResponse
      ] = await Promise.all([
        axios.get(
          "https://skillbridge-ai-1-s5wk.onrender.com/skillbridge-ai-1-s5wk.onrender.com/activity/streak",
          { headers }
        ),

        axios.get(
          "https://skillbridge-ai-1-s5wk.onrender.com/skillbridge-ai-1-s5wk.onrender.com/assessment/all",
          { headers }
        ),

        axios.get(
          "https://skillbridge-ai-1-s5wk.onrender.com/skillbridge-ai-1-s5wk.onrender.com/quiz/results",
          { headers }
        )
      ]);

      setStreak(streakResponse.data);
      setAssessments(assessmentResponse.data);
      setQuizResults(quizResponse.data);

    } catch (error) {
      console.error("Progress data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const latestAssessment =
    assessments.length > 0
      ? assessments[0]
      : null;

  const overallProgress =
    assessments.length > 0
      ? Math.round(
        assessments.reduce(
          (total, assessment) =>
            total + assessment.percentage,
          0
        ) / assessments.length
      )
      : 0;

  const averageQuizScore =
    quizResults.length > 0
      ? Math.round(
        quizResults.reduce(
          (total, quiz) =>
            total + quiz.percentage,
          0
        ) / quizResults.length
      )
      : 0;



  const getRecommendations = (assessment) => {
    const skill = assessment.skill;
    const percentage = assessment.percentage;

    const recommendations = {
      html: {
        needsImprovement: [
          "HTML Basics",
          "Semantic HTML",
          "Forms and Input Elements",
          "Practice HTML Quiz"
        ],
        average: [
          "Advanced HTML",
          "HTML Accessibility",
          "SEO-friendly HTML",
          "Build a Responsive Web Page"
        ],
        strong: [
          "Advanced Accessibility",
          "SEO Optimization",
          "Web Standards",
          "Build a Professional Website"
        ]
      },

      css: {
        needsImprovement: [
          "CSS Basics",
          "Selectors and Properties",
          "Flexbox",
          "Practice CSS Quiz"
        ],
        average: [
          "Advanced Flexbox",
          "CSS Grid",
          "Responsive Design",
          "Build a Responsive UI"
        ],
        strong: [
          "Advanced CSS",
          "Animations and Transitions",
          "Responsive Architecture",
          "Build a Professional UI"
        ]
      },

      javascript: {
        needsImprovement: [
          "JavaScript Basics",
          "Variables and Functions",
          "Arrays and Objects",
          "Practice JavaScript Quiz"
        ],
        average: [
          "ES6 Concepts",
          "DOM Manipulation",
          "Async JavaScript",
          "Build a JavaScript Project"
        ],
        strong: [
          "Advanced JavaScript",
          "Promises and Async/Await",
          "API Integration",
          "Build a Full JavaScript Project"
        ]
      },

      react: {
        needsImprovement: [
          "React Basics",
          "Components and JSX",
          "Props and State",
          "Practice React Quiz"
        ],
        average: [
          "React Hooks",
          "Component Design",
          "API Integration",
          "Build a React Project"
        ],
        strong: [
          "Advanced React",
          "Performance Optimization",
          "Advanced Hooks",
          "Build a Production-ready React App"
        ]
      },

      node: {
        needsImprovement: [
          "Node.js Basics",
          "Modules and npm",
          "Express.js Basics",
          "Practice Backend Quiz"
        ],
        average: [
          "Express.js",
          "REST APIs",
          "Middleware",
          "Build a Backend API"
        ],
        strong: [
          "Advanced Node.js",
          "Authentication and JWT",
          "API Security",
          "Build a Production-ready API"
        ]
      },

      sql: {
        needsImprovement: [
          "SQL Basics",
          "SELECT and WHERE",
          "Sorting and Filtering",
          "Practice SQL Quiz"
        ],
        average: [
          "SQL Joins",
          "Aggregate Functions",
          "Subqueries",
          "Database Design"
        ],
        strong: [
          "Advanced SQL",
          "Query Optimization",
          "Database Design",
          "Build a Database-driven Project"
        ]
      },

      default: {
        needsImprovement: [
          "Learn the Basics",
          "Understand Core Concepts",
          "Practice Important Questions",
          "Take a Skill Quiz"
        ],
        average: [
          "Strengthen Core Concepts",
          "Practice Intermediate Topics",
          "Solve More Questions",
          "Build a Small Project"
        ],
        strong: [
          "Learn Advanced Concepts",
          "Solve Real-world Problems",
          "Work on Advanced Projects",
          "Practice Interview Questions"
        ]
      }
    };

    const skillKey = skill
      ? skill.toLowerCase().trim()
      : "default";

    const skillData =
      recommendations[skillKey] ||
      recommendations.default;

    if (percentage < 60) {
      return {
        level: "Needs Improvement",
        className: "recommendation-needs",
        topics: skillData.needsImprovement
      };
    }

    if (percentage < 80) {
      return {
        level: "Average",
        className: "recommendation-average",
        topics: skillData.average
      };
    }

    return {
      level: "Strong",
      className: "recommendation-strong",
      topics: skillData.strong
    };
  };

  const getLastSevenDays = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      const dateString =
        date.toLocaleDateString(
          "en-CA",
          {
            timeZone: "Asia/Kolkata"
          }
        );

      const dayName =
        date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
            timeZone: "Asia/Kolkata"
          }
        );

      days.push({
        date: dateString,
        day: dayName
      });
    }

    return days;
  };

  const weeklyDays = getLastSevenDays();

  return (
    <div className="progress-page">

      <header className="progress-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <h1>Your Progress</h1>

          <p>
            Track your learning consistency and skill growth.
          </p>
        </div>

      </header>



      <section className="streak-section">

        <div className="streak-main">

          <div className="streak-icon">
            🔥
          </div>

          <div>

            <span className="section-label">
              DAILY LEARNING STREAK
            </span>

            <h2>
              {loading
                ? "..."
                : `${streak.currentStreak} Days`}
            </h2>

            <p>
              Keep learning every day to maintain your streak.
            </p>

          </div>

        </div>


        <div className="streak-stats">

          <div className="streak-stat">

            <span>Current Streak</span>

            <strong>
              {loading
                ? "..."
                : streak.currentStreak}
            </strong>

            <small>days</small>

          </div>


          <div className="streak-stat">

            <span>Longest Streak</span>

            <strong>
              {loading
                ? "..."
                : streak.longestStreak}
            </strong>

            <small>days</small>

          </div>

        </div>


        <div className="weekly-activity">

          <div className="weekly-header">

            <h3>This Week</h3>

            <span>
              {streak.activityDates.length > 0
                ? "Learning activity tracked"
                : "Start learning to build your streak"}
            </span>

          </div>


          <div className="week-days">

            {weeklyDays.map((day) => {

              const completed =
                streak.activityDates.includes(day.date);

              return (
                <div
                  className={`day-item ${completed ? "completed" : ""
                    }`}
                  key={day.date}
                >

                  <span className="day-name">
                    {day.day}
                  </span>

                  <div className="day-circle">
                    {completed ? "✓" : ""}
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>



      <section className="progress-overview">

        <div className="progress-title">

          <span className="section-label">
            LEARNING OVERVIEW
          </span>

          <h2>Your Learning Journey</h2>

          <p>
            Monitor your consistency and progress as you build
            your technical skills.
          </p>

        </div>


        <div className="progress-cards">

          <div className="progress-card">

            <span>Overall Progress</span>

            <strong>
              {loading
                ? "..."
                : `${overallProgress}%`}
            </strong>

            <p>
              Average assessment performance
            </p>

          </div>


          <div className="progress-card">

            <span>Skills Assessed</span>

            <strong>
              {loading
                ? "..."
                : assessments.length}
            </strong>

            <p>
              Skill assessments completed
            </p>

          </div>


          <div className="progress-card">

            <span>Quiz Average</span>

            <strong>
              {loading
                ? "..."
                : `${averageQuizScore}%`}
            </strong>

            <p>
              Average practice quiz score
            </p>

          </div>

        </div>

      </section>


      {/* LATEST PERFORMANCE */}

      <section className="progress-section">

        <div className="progress-section-header">

          <div>

            <span className="section-label">
              LATEST PERFORMANCE
            </span>

            <h2>Latest Skill Level</h2>

            <p>
              Your most recent assessment performance.
            </p>

          </div>

        </div>


        {loading ? (

          <p>Loading latest assessment...</p>

        ) : latestAssessment ? (

          <div className="latest-skill-card">

            <div>

              <h3>
                {latestAssessment.skill}
              </h3>

              <span>
                {latestAssessment.level}
              </span>

            </div>


            <div className="latest-score">

              <strong>
                {latestAssessment.percentage}%
              </strong>

              <small>Score</small>

            </div>

          </div>

        ) : (

          <div className="empty-state">

            <h3>
              No assessment completed yet
            </h3>

            <p>
              Complete your first skill assessment
              to start tracking your progress.
            </p>

          </div>

        )}

      </section>




      <section className="progress-section">

        <div className="progress-section-header">

          <div>

            <span className="section-label">
              SKILL PERFORMANCE
            </span>

            <h2>Your Skills</h2>

            <p>
              Performance across your assessed skills.
            </p>

          </div>

        </div>


        {loading ? (

          <p>Loading skill performance...</p>

        ) : assessments.length === 0 ? (

          <div className="empty-state">

            <h3>
              No skills assessed yet
            </h3>

            <p>
              Complete a skill assessment to see
              your competency progress here.
            </p>

          </div>

        ) : (

          <div className="skill-performance-grid">

            {assessments.map((assessment) => (

              <div
                className="skill-performance-card"
                key={assessment._id}
              >

                <div className="skill-card-top">

                  <div className="skill-card-title">

                    <div className="skill-mini-icon">

                      {assessment.skill
                        ? assessment.skill
                          .charAt(0)
                          .toUpperCase()
                        : "S"}

                    </div>

                    <div>

                      <h3>
                        {assessment.skill}
                      </h3>

                      <span>
                        Skill Assessment
                      </span>

                    </div>

                  </div>


                  <div className="skill-score">

                    <strong>
                      {assessment.percentage}%
                    </strong>

                  </div>

                </div>


                <div className="skill-level-row">

                  <span>
                    Competency Level
                  </span>

                  <span className="skill-level-badge">
                    {assessment.level}
                  </span>

                </div>


                <div className="skill-progress-wrapper">

                  <div className="skill-progress-track">

                    <div
                      className={`skill-progress-fill ${assessment.percentage >= 80
                          ? "strong"
                          : assessment.percentage >= 60
                            ? "good"
                            : "needs-improvement"
                        }`}
                      style={{
                        width:
                          `${assessment.percentage}%`
                      }}
                    ></div>

                  </div>

                </div>


                <div className="skill-card-footer">

                  <span>
                    Current performance
                  </span>

                  <span>

                    {assessment.percentage >= 80
                      ? "Strong"
                      : assessment.percentage >= 60
                        ? "Good"
                        : "Needs Improvement"}

                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      <section className="progress-section">

        <div className="progress-section-header">

          <div>

            <span className="section-label">
              PERSONALIZED RECOMMENDATIONS
            </span>

            <h2>Recommended Learning Path</h2>

            <p>
              Based on your assessment performance,
              here is what you should focus on next.
            </p>

          </div>

        </div>


        {loading ? (

          <p>Loading recommendations...</p>

        ) : assessments.length === 0 ? (

          <div className="empty-state">

            <h3>
              Complete an assessment first
            </h3>

            <p>
              Once you complete a skill assessment,
              SkillBridge will recommend what you should
              learn next.
            </p>

          </div>

        ) : (

          <div className="recommendation-grid">

            {assessments.slice(0, 5).map((assessment) => {

              const recommendation =
                getRecommendations(assessment);

              return (
                <div
                  className="recommendation-card"
                  key={`recommendation-${assessment._id}`}
                >

                  <div className="recommendation-top">

                    <div>

                      <h3>
                        {assessment.skill}
                      </h3>

                      <span>
                        Current score: {assessment.percentage}%
                      </span>

                    </div>

                    <span
                      className={`recommendation-level ${recommendation.className
                        }`}
                    >
                      {recommendation.level}
                    </span>

                  </div>


                  <div className="recommendation-line"></div>


                  <div className="recommendation-content">

                    <h4>
                      Suggested Learning Path
                    </h4>

                    <div className="recommendation-topics">

                      {recommendation.topics.map(
                        (topic, index) => (

                          <div
                            className="recommendation-topic"
                            key={topic}
                          >

                            <span className="topic-number">
                              {index + 1}
                            </span>

                            <span>
                              {topic}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>


      <section className="progress-section">

        <div className="progress-section-header">

          <div>

            <span className="section-label">
              PRACTICE PERFORMANCE
            </span>

            <h2>Quiz Performance</h2>

            <p>
              Track your practice quiz results and improvement.
            </p>

          </div>

        </div>


        {loading ? (

          <p>Loading quiz performance...</p>

        ) : quizResults.length === 0 ? (

          <div className="empty-state">

            <h3>
              No quizzes completed yet
            </h3>

            <p>
              Complete a practice quiz to start
              tracking your quiz performance.
            </p>

          </div>

        ) : (

          <div className="quiz-performance-list">

            {quizResults.slice(0, 5).map((quiz) => (

              <div
                className="quiz-performance-row"
                key={quiz._id}
              >

                <div>

                  <h3>
                    {quiz.skill}
                  </h3>

                  <span>
                    {quiz.score}/{quiz.totalQuestions} correct
                  </span>

                </div>


                <div className="quiz-performance-score">

                  <strong>
                    {quiz.percentage}%
                  </strong>

                  <small>
                    {quiz.level}
                  </small>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      <section className="progress-section">

        <div className="progress-section-header">

          <div>

            <span className="section-label">
              RECENT ACTIVITY
            </span>

            <h2>Recent Assessment Results</h2>

            <p>
              Review your completed skill assessments.
            </p>

          </div>

        </div>


        {assessments.length > 0 ? (

          <div className="assessment-history">

            {assessments
              .slice(0, 5)
              .map((assessment) => (

                <div
                  className="assessment-history-row"
                  key={assessment._id}
                >

                  <div>

                    <h3>
                      {assessment.skill}
                    </h3>

                    <span>
                      {assessment.level}
                    </span>

                  </div>


                  <div className="history-score">

                    <strong>
                      {assessment.percentage}%
                    </strong>

                  </div>

                </div>

              ))}

          </div>

        ) : (

          <p>
            No assessment history available.
          </p>

        )}

      </section>

      <section className="progress-message">

        <div className="message-icon">
          ✨
        </div>

        <div>

          <h3>
            Consistency builds strong skills.
          </h3>

          <p>
            Complete an assessment or quiz every day
            to continue building your learning streak.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Progress;