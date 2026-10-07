import { useEffect, useState } from "react";
import axios from "axios";
import "./Progress.css";

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
          "http://localhost:5000/activity/streak",
          { headers }
        ),

        axios.get(
          "http://localhost:5000/assessment/all",
          { headers }
        ),

        axios.get(
          "http://localhost:5000/quiz/results",
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

  const latestQuiz =
    quizResults.length > 0
      ? quizResults[0]
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

      {/* HEADER */}

      <header className="progress-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <h1>Your Progress</h1>
          <p>
            Track your learning consistency and skill growth.
          </p>
        </div>
      </header>


      {/* DAILY STREAK */}

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
                  className={`day-item ${
                    completed ? "completed" : ""
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


      {/* LEARNING OVERVIEW */}

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


      {/* LATEST ASSESSMENT */}

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


      {/* SKILL PERFORMANCE */}

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
                      className={`skill-progress-fill ${
                        assessment.percentage >= 80
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


      {/* QUIZ PERFORMANCE */}

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


      {/* RECENT ASSESSMENTS */}

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


      {/* MOTIVATION */}

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