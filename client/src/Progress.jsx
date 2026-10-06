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
        console.error(
          "Progress data fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const averageAssessment =
    assessmentResults.length > 0
      ? Math.round(
          assessmentResults.reduce(
            (total, result) =>
              total + result.percentage,
            0
          ) / assessmentResults.length
        )
      : 0;

  const averageQuiz =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce(
            (total, result) =>
              total + result.percentage,
            0
          ) / quizResults.length
        )
      : 0;

  const overallProgress =
    assessmentResults.length > 0 ||
    quizResults.length > 0
      ? Math.round(
          (averageAssessment + averageQuiz) /
            (
              (assessmentResults.length > 0 ? 1 : 0) +
              (quizResults.length > 0 ? 1 : 0)
            )
        )
      : 0;

  const getLevelClass = (percentage) => {
    if (percentage >= 80) return "advanced";
    if (percentage >= 60) return "strong";
    if (percentage >= 40) return "average";
    return "needs-improvement";
  };

  if (loading) {
    return (
      <div className="progress-page">
        <div className="progress-container">
          <div className="progress-loading">
            Loading your progress...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">

      <div className="progress-container">

        {/* HEADER */}

        <div className="progress-header">

          <button
            className="progress-back"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span className="progress-label">
              SKILLBRIDGE AI • PERFORMANCE
            </span>

            <h1>Your Progress</h1>

            <p>
              Track your learning performance across
              assessments and quizzes.
            </p>
          </div>

        </div>


        {/* OVERVIEW */}

        <div className="progress-overview">

          <div className="progress-overview-card main-progress">

            <div className="progress-card-top">
              <span>Overall Progress</span>
              <span className="progress-percentage">
                {overallProgress}%
              </span>
            </div>

            <div className="overall-progress-bar">
              <div
                className="overall-progress-fill"
                style={{
                  width: `${overallProgress}%`
                }}
              ></div>
            </div>

            <p>
              Combined performance from your
              assessments and quizzes.
            </p>

          </div>


          <div className="progress-overview-card">

            <span className="progress-card-label">
              Skill Assessments
            </span>

            <strong>
              {averageAssessment}%
            </strong>

            <small>
              {assessmentResults.length} assessment
              {assessmentResults.length !== 1
                ? "s"
                : ""}
            </small>

          </div>


          <div className="progress-overview-card">

            <span className="progress-card-label">
              Quizzes Completed
            </span>

            <strong>
              {quizResults.length}
            </strong>

            <small>
              {averageQuiz}% average score
            </small>

          </div>

        </div>


        {/* ASSESSMENT PERFORMANCE */}

        <section className="progress-section">

          <div className="section-heading">
            <div>
              <span>ASSESSMENT PERFORMANCE</span>
              <h2>Skill Assessments</h2>
            </div>
          </div>

          {assessmentResults.length === 0 ? (
            <div className="empty-progress">
              No skill assessments completed yet.
            </div>
          ) : (
            <div className="progress-list">

              {assessmentResults.map((result) => (
                <div
                  className="progress-item"
                  key={result._id}
                >

                  <div className="progress-item-info">

                    <div>
                      <h3>{result.skill}</h3>

                      <span>
                        Assessment
                      </span>
                    </div>

                    <div className="progress-item-score">
                      <strong>
                        {result.percentage}%
                      </strong>

                      <span
                        className={`progress-level ${getLevelClass(
                          result.percentage
                        )}`}
                      >
                        {result.level}
                      </span>
                    </div>

                  </div>

                  <div className="item-progress-bar">
                    <div
                      className="item-progress-fill"
                      style={{
                        width: `${result.percentage}%`
                      }}
                    ></div>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>


        {/* QUIZ PERFORMANCE */}

        <section className="progress-section">

          <div className="section-heading">
            <div>
              <span>QUIZ PERFORMANCE</span>
              <h2>Recent Quiz Results</h2>
            </div>
          </div>

          {quizResults.length === 0 ? (
            <div className="empty-progress">
              No quizzes completed yet.
            </div>
          ) : (
            <div className="progress-list">

              {quizResults.map((result) => (
                <div
                  className="progress-item"
                  key={result._id}
                >

                  <div className="progress-item-info">

                    <div>
                      <h3>{result.skill}</h3>

                      <span>
                        {result.score} /{" "}
                        {result.totalQuestions} correct
                      </span>
                    </div>

                    <div className="progress-item-score">

                      <strong>
                        {result.percentage}%
                      </strong>

                      <span
                        className={`progress-level ${getLevelClass(
                          result.percentage
                        )}`}
                      >
                        {result.level}
                      </span>

                    </div>

                  </div>

                  <div className="item-progress-bar">
                    <div
                      className="item-progress-fill"
                      style={{
                        width: `${result.percentage}%`
                      }}
                    ></div>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default Progress;