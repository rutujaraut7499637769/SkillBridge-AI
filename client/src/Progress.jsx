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

      const [streakResponse, assessmentResponse] =
        await Promise.all([
          axios.get(
            "http://localhost:5000/activity/streak",
            { headers }
          ),

          axios.get(
            "http://localhost:5000/assessment/all",
            { headers }
          )
        ]);

      setStreak(streakResponse.data);
      setAssessments(assessmentResponse.data);

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


  const getLastSevenDays = () => {

    const days = [];

    for (let i = 6; i >= 0; i--) {

      const date = new Date();

      date.setDate(
        date.getDate() - i
      );

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

          <h1>
            Your Progress
          </h1>

          <p>
            Track your learning consistency and
            skill growth.
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
              Keep learning every day to maintain
              your streak.
            </p>

          </div>

        </div>


        <div className="streak-stats">

          <div className="streak-stat">

            <span>
              Current Streak
            </span>

            <strong>
              {loading
                ? "..."
                : streak.currentStreak}
            </strong>

            <small>
              days
            </small>

          </div>


          <div className="streak-stat">

            <span>
              Longest Streak
            </span>

            <strong>
              {loading
                ? "..."
                : streak.longestStreak}
            </strong>

            <small>
              days
            </small>

          </div>

        </div>


        {/* WEEKLY ACTIVITY */}

        <div className="weekly-activity">

          <div className="weekly-header">

            <h3>
              This Week
            </h3>

            <span>
              {streak.activityDates.length > 0
                ? "Learning activity tracked"
                : "Start learning to build your streak"}
            </span>

          </div>


          <div className="week-days">

            {weeklyDays.map((day) => {

              const completed =
                streak.activityDates.includes(
                  day.date
                );

              return (

                <div
                  className={`day-item ${
                    completed
                      ? "completed"
                      : ""
                  }`}
                  key={day.date}
                >

                  <span className="day-name">
                    {day.day}
                  </span>

                  <div className="day-circle">

                    {completed
                      ? "✓"
                      : ""}

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

          <h2>
            Your Learning Journey
          </h2>

          <p>
            Monitor your consistency and progress
            as you build your technical skills.
          </p>

        </div>


        <div className="progress-cards">


          {/* OVERALL PROGRESS */}

          <div className="progress-card">

            <span>
              Overall Progress
            </span>

            <strong>
              {loading
                ? "..."
                : `${overallProgress}%`}
            </strong>

            <p>
              Average assessment performance
            </p>

          </div>


          {/* SKILLS ASSESSED */}

          <div className="progress-card">

            <span>
              Skills Assessed
            </span>

            <strong>
              {loading
                ? "..."
                : assessments.length}
            </strong>

            <p>
              Skill assessments completed
            </p>

          </div>


          {/* ACTIVE DAYS */}

          <div className="progress-card">

            <span>
              Active Days
            </span>

            <strong>
              {loading
                ? "..."
                : streak.activityDates.length}
            </strong>

            <p>
              Total learning days
            </p>

          </div>

        </div>

      </section>



      {/* LATEST SKILL */}

      <section className="progress-section">

        <div className="progress-section-header">

          <div>

            <span className="section-label">
              LATEST PERFORMANCE
            </span>

            <h2>
              Latest Skill Level
            </h2>

            <p>
              Your most recent assessment performance.
            </p>

          </div>

        </div>


        {loading ? (

          <p>
            Loading latest assessment...
          </p>

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

              <small>
                Score
              </small>

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

            <h2>
              Your Skills
            </h2>

            <p>
              Performance across your assessed skills.
            </p>

          </div>

        </div>


        {loading ? (

          <p>
            Loading skill performance...
          </p>

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

          <div className="progress-skills-list">

            {assessments.map((assessment) => (

              <div
                className="progress-skill-row"
                key={assessment._id}
              >

                <div className="progress-skill-info">

                  <div>

                    <h3>
                      {assessment.skill}
                    </h3>

                    <span>
                      {assessment.level}
                    </span>

                  </div>

                  <strong>
                    {assessment.percentage}%
                  </strong>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${assessment.percentage}%`
                    }}
                  ></div>

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

            <h2>
              Recent Assessment Results
            </h2>

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
            Complete an assessment or quiz every
            day to continue building your learning
            streak.
          </p>

        </div>

      </section>


    </div>
  );
}

export default Progress;