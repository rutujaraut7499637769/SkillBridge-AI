
import { useEffect, useState } from "react";
import axios from "axios";
import "./Progress.css";

function Progress({ onBack }) {
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [assessmentResponse, quizResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/assessment/all",
              config
            ),
            axios.get(
              "http://localhost:5000/quiz/results",
              config
            )
          ]);

        setAssessmentResults(assessmentResponse.data);
        setQuizResults(quizResponse.data);

      } catch (error) {
        console.error("Progress data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const assessmentAverage =
    assessmentResults.length > 0
      ? Math.round(
          assessmentResults.reduce(
            (total, item) => total + item.percentage,
            0
          ) / assessmentResults.length
        )
      : 0;

  const quizAverage =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce(
            (total, item) => total + item.percentage,
            0
          ) / quizResults.length
        )
      : 0;

  const overallProgress =
    assessmentResults.length > 0 || quizResults.length > 0
      ? Math.round(
          (
            assessmentAverage +
            quizAverage
          ) /
          (
            (assessmentResults.length > 0 ? 1 : 0) +
            (quizResults.length > 0 ? 1 : 0)
          )
        )
      : 0;

  const getLevel = (percentage) => {
    if (percentage >= 80) return "Advanced";
    if (percentage >= 60) return "Strong";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
  };

  const getLevelClass = (percentage) => {
    if (percentage >= 80) return "advanced";
    if (percentage >= 60) return "strong";
    if (percentage >= 40) return "average";
    return "needs";
  };

  const totalActivities =
    assessmentResults.length + quizResults.length;

  if (loading) {
    return (
      <div className="progress-page">
        <div className="progress-loading">
          Loading your progress...
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">

      <div className="progress-container">

        {/* HEADER */}

        <div className="progress-top">

          <button
            className="back-button"
            onClick={onBack}
          >
            ←
          </button>

          <div>
            <span className="eyebrow">
              SKILLBRIDGE AI
            </span>

            <h1>Learning Progress</h1>

            <p>
              See how your skills are growing over time.
            </p>
          </div>

        </div>


        {/* HERO */}

        <div className="progress-hero">

          <div className="hero-content">

            <span>YOUR OVERALL PERFORMANCE</span>

            <h2>
              {overallProgress}%
            </h2>

            <p>
              Keep learning, practicing and improving
              your skills.
            </p>

          </div>

          <div className="circle-progress">

            <div className="circle-inner">
              <strong>
                {overallProgress}%
              </strong>

              <span>Progress</span>
            </div>

          </div>

        </div>


        {/* STAT CARDS */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              🎯
            </div>

            <div>
              <span>Skills Assessed</span>

              <strong>
                {assessmentResults.length}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>
              <span>Quizzes Completed</span>

              <strong>
                {quizResults.length}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📊
            </div>

            <div>
              <span>Assessment Average</span>

              <strong>
                {assessmentAverage}%
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⚡
            </div>

            <div>
              <span>Total Activities</span>

              <strong>
                {totalActivities}
              </strong>
            </div>

          </div>

        </div>


        {/* PERFORMANCE */}

        <section className="progress-section">

          <div className="section-title">

            <span>PERFORMANCE OVERVIEW</span>

            <h2>
              Your learning performance
            </h2>

          </div>


          <div className="performance-grid">

            <div className="performance-card">

              <div className="performance-heading">

                <div>
                  <h3>
                    Skill Assessments
                  </h3>

                  <p>
                    Competency evaluation
                  </p>
                </div>

                <strong>
                  {assessmentAverage}%
                </strong>

              </div>

              <div className="large-bar">

                <div
                  style={{
                    width: `${assessmentAverage}%`
                  }}
                ></div>

              </div>

            </div>


            <div className="performance-card">

              <div className="performance-heading">

                <div>
                  <h3>
                    Quiz Practice
                  </h3>

                  <p>
                    Knowledge practice
                  </p>
                </div>

                <strong>
                  {quizAverage}%
                </strong>

              </div>

              <div className="large-bar quiz-bar">

                <div
                  style={{
                    width: `${quizAverage}%`
                  }}
                ></div>

              </div>

            </div>

          </div>

        </section>


        {/* SKILL GROWTH */}

        <section className="progress-section">

          <div className="section-title">

            <span>SKILL GROWTH</span>

            <h2>
              Your assessed skills
            </h2>

          </div>


          {assessmentResults.length === 0 ? (

            <div className="empty-state">
              Complete a skill assessment to start
              tracking your skill growth.
            </div>

          ) : (

            <div className="skill-growth-list">

              {assessmentResults.map((result) => (

                <div
                  className="growth-item"
                  key={result._id}
                >

                  <div className="growth-left">

                    <div className="skill-avatar">
                      {result.skill
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {result.skill}
                      </h3>

                      <span>
                        {getLevel(result.percentage)}
                      </span>

                    </div>

                  </div>


                  <div className="growth-right">

                    <strong>
                      {result.percentage}%
                    </strong>

                    <div className="mini-bar">

                      <div
                        className={getLevelClass(
                          result.percentage
                        )}
                        style={{
                          width: `${result.percentage}%`
                        }}
                      ></div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* RECENT ACTIVITY */}

        <section className="progress-section">

          <div className="section-title">

            <span>RECENT ACTIVITY</span>

            <h2>
              Your learning activity
            </h2>

          </div>


          <div className="activity-list">

            {assessmentResults
              .slice(0, 3)
              .map((result) => (

                <div
                  className="activity-item"
                  key={`assessment-${result._id}`}
                >

                  <div className="activity-icon">
                    🎯
                  </div>

                  <div className="activity-info">

                    <h3>
                      {result.skill} assessment completed
                    </h3>

                    <p>
                      Performance level:{" "}
                      {result.level}
                    </p>

                  </div>

                  <strong>
                    {result.percentage}%
                  </strong>

                </div>

              ))}


            {quizResults
              .slice(0, 3)
              .map((result) => (

                <div
                  className="activity-item"
                  key={`quiz-${result._id}`}
                >

                  <div className="activity-icon">
                    📝
                  </div>

                  <div className="activity-info">

                    <h3>
                      {result.skill} quiz completed
                    </h3>

                    <p>
                      {result.score} /{" "}
                      {result.totalQuestions} correct
                    </p>

                  </div>

                  <strong>
                    {result.percentage}%
                  </strong>

                </div>

              ))}


            {totalActivities === 0 && (

              <div className="empty-state">
                No learning activity yet.
              </div>

            )}

          </div>

        </section>


        {/* FOOTER MESSAGE */}

        <div className="progress-message">

          <div>
            🚀
          </div>

          <div>

            <h3>
              Keep building your skills
            </h3>

            <p>
              Every assessment and quiz brings you
              one step closer to your learning goals.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Progress;