import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard({ onSkillAssessment, onMySkills }) {

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/assessment/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAssessments(response.data);

    } catch (error) {
      console.log("Error fetching assessments:", error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  // Latest assessment
  const latestAssessment = assessments.length > 0
    ? assessments[0]
    : null;

  // Overall progress
  const overallProgress = assessments.length > 0
    ? Math.round(
        assessments.reduce(
          (total, assessment) => total + assessment.percentage,
          0
        ) / assessments.length
      )
    : 0;

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-logo">SB</div>
          <h2>SkillBridge AI</h2>
        </div>

        <nav className="sidebar-menu">

          <button className="menu-item active">
            🏠 Dashboard
          </button>

          <button
            className="menu-item"
            onClick={onSkillAssessment}
          >
            📊 Skill Assessment
          </button>

          <button
            className="menu-item"
            onClick={onMySkills}
          >
            🧠 My Skills
          </button>

          <button className="menu-item">
            🗺️ Learning Roadmap
          </button>

          <button className="menu-item">
            📝 Quizzes
          </button>

          <button className="menu-item">
            📈 Progress
          </button>

          <button className="menu-item">
            👤 Profile
          </button>

        </nav>

        <button className="logout-button">
          🚪 Logout
        </button>

      </aside>


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">

          <div>
            <h1>Welcome back 👋</h1>

            <p>
              Continue your personalized learning journey.
            </p>
          </div>

          <div className="profile-circle">
            R
          </div>

        </div>


        {/* Overview Cards */}
        <div className="overview-grid">

          {/* Overall Progress */}
          <div className="overview-card">

            <span>Overall Progress</span>

            <h2>
              {loading ? "..." : `${overallProgress}%`}
            </h2>

            <p>
              {assessments.length > 0
                ? "Based on assessed skills"
                : "Start your first assessment"}
            </p>

          </div>


          {/* Skills Assessed */}
          <div className="overview-card">

            <span>Skills Assessed</span>

            <h2>
              {loading ? "..." : assessments.length}
            </h2>

            <p>
              {assessments.length > 0
                ? "Skill assessments completed"
                : "No assessment completed"}
            </p>

          </div>


          {/* Latest Level */}
          <div className="overview-card">

            <span>Latest Skill Level</span>

            <h2>
              {loading
                ? "..."
                : latestAssessment
                ? latestAssessment.level
                : "—"}
            </h2>

            <p>
              {latestAssessment
                ? `${latestAssessment.skill} • ${latestAssessment.percentage}%`
                : "Complete an assessment"}
            </p>

          </div>

        </div>


        {/* Skill Performance */}
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
                Complete your first skill assessment to see
                your competency level here.
              </p>

              <button
                className="primary-button"
                onClick={onSkillAssessment}
              >
                Start Assessment
              </button>

            </div>

          ) : (

            <div className="skills-list">

              {assessments.map((assessment) => (

                <div
                  className="skill-row"
                  key={assessment._id}
                >

                  <div className="skill-info">

                    <h3>{assessment.skill}</h3>

                    <span>
                      {assessment.level}
                    </span>

                  </div>


                  <div className="skill-progress">

                    <div className="progress-track">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${assessment.percentage}%`
                        }}
                      ></div>

                    </div>

                    <strong>
                      {assessment.percentage}%
                    </strong>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* Start Assessment */}
        <div className="dashboard-section">

          <h2>Improve Your Skills</h2>

          <p>
            Take skill assessments to identify your strengths,
            competency gaps and build your personalized learning path.
          </p>

          <button
            className="primary-button"
            onClick={onSkillAssessment}
          >
            Start Skill Assessment
          </button>

        </div>


        {/* Recommended Learning */}
        <div className="dashboard-section">

          <h2>Recommended Learning</h2>

          <p>
            Your personalized recommendations will appear
            here after the AI competency-gap analysis is implemented.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;