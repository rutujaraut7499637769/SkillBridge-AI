import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard({
  onSkillAssessment,
  onMySkills,
  onLearningRoadmap,
  onQuiz,
  onProgress,
  onProfile,
  onLogout
}) {

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  // User profile information
  const [user, setUser] = useState(null);

  const API_URL = "https://skillbridge-ai-1-s5wk.onrender.com/skillbridge-ai-1-s5wk.onrender.com/";


  useEffect(() => {
    fetchAssessments();
    fetchProfile();
  }, []);


  // Fetch user's assessment results
  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/assessment/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAssessments(response.data);

    } catch (error) {
      console.log(
        "Error fetching assessments:",
        error
      );

      setAssessments([]);

    } finally {
      setLoading(false);
    }
  };


  // Fetch logged-in user's profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data.user);

    } catch (error) {
      console.log(
        "Error fetching profile:",
        error
      );
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


  const getNextLearning = (assessment) => {

    const skill =
      assessment.skill?.toLowerCase();

    const score =
      assessment.percentage;

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


    const selectedSkill =
      topics[skill];


    if (!selectedSkill) {

      if (score < 60) {
        return "Learn the basics → Core concepts → Practice Quiz";
      }

      if (score < 80) {
        return "Intermediate concepts → Practice → Small Project";
      }

      return "Advanced concepts → Real-world problems → Advanced Project";
    }


    if (score < 60) {
      return selectedSkill.weak;
    }

    if (score < 80) {
      return selectedSkill.average;
    }

    return selectedSkill.strong;
  };


  // Profile image URL
  const profileImage =
    user?.profileImage
      ? `${API_URL}${user.profileImage}`
      : null;


  // User's first letter if profile photo is not available
  const userInitial =
    user?.name
      ? user.name
          .charAt(0)
          .toUpperCase()
      : "R";


  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            SB
          </div>

          <h2>
            SkillBridge AI
          </h2>

        </div>


        <nav className="sidebar-menu">

          <button
            className="menu-item active"
          >
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


          <button
            className="menu-item"
            onClick={() =>
              onLearningRoadmap(
                latestAssessment?.skill || ""
              )
            }
          >
            🗺️ Learning Roadmap
          </button>


          <button
            className="menu-item"
            onClick={onQuiz}
          >
            📝 Quiz
          </button>


          <button
            className="menu-item"
            onClick={onProgress}
          >
            📈 Progress
          </button>


          <button
            className="menu-item"
            onClick={onProfile}
          >
            👤 Profile
          </button>

        </nav>


        <button
          className="logout-button"
          onClick={onLogout}
        >
          🚪 Logout
        </button>

      </aside>


      <main className="dashboard-main">

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome back 👋
            </h1>

            <p>
              Continue your personalized learning journey.
            </p>

          </div>


          {/* Dashboard Profile Photo */}
          <div
            className="profile-circle"
            onClick={onProfile}
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
              Overall Progress
            </span>

            <h2>
              {loading
                ? "..."
                : `${overallProgress}%`}
            </h2>

            <p>
              {assessments.length > 0
                ? "Based on assessed skills"
                : "Start your first assessment"}
            </p>

          </div>


          <div className="overview-card">

            <span>
              Skills Assessed
            </span>

            <h2>
              {loading
                ? "..."
                : assessments.length}
            </h2>

            <p>
              {assessments.length > 0
                ? "Skill assessments completed"
                : "No assessment completed"}
            </p>

          </div>


          <div className="overview-card">

            <span>
              Latest Skill Level
            </span>

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


        <div className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                Skill Performance
              </h2>

              <p>
                Your latest performance across assessed skills.
              </p>

            </div>

          </div>


          {loading ? (

            <p>
              Loading assessment results...
            </p>

          ) : assessments.length === 0 ? (

            <div className="empty-state">

              <h3>
                No skills assessed yet
              </h3>

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

              {assessments.map(
                (assessment) => (

                  <div
                    className="skill-row"
                    key={assessment._id}
                  >

                    <div className="skill-info">

                      <h3>
                        {assessment.skill}
                      </h3>

                      <span>
                        {assessment.level}
                      </span>

                    </div>


                    <div className="skill-progress">

                      <div className="progress-track">

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
                        />

                      </div>

                      <strong>
                        {assessment.percentage}%
                      </strong>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        <div className="dashboard-section">

          <h2>
            Improve Your Skills
          </h2>

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


        <div className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                Recommended Next Step
              </h2>

              <p>
                Based on your latest skill assessment.
              </p>

            </div>

          </div>


          {latestAssessment ? (

            <div className="dashboard-recommendation">

              <div className="recommendation-info">

                <span className="recommendation-label">
                  NEXT FOR YOU
                </span>

                <h3>
                  {latestAssessment.skill}
                </h3>

                <p>
                  Your current level is{" "}
                  <strong>
                    {latestAssessment.level}
                  </strong>.
                </p>


                <div className="next-learning-path">

                  <span>
                    Recommended next:
                  </span>

                  <strong>
                    {getNextLearning(
                      latestAssessment
                    )}
                  </strong>

                </div>


                <button
                  className="roadmap-button"
                  onClick={() =>
                    onLearningRoadmap(
                      latestAssessment.skill
                    )
                  }
                >
                  View Learning Roadmap →
                </button>

              </div>


              <div className="recommendation-score">

                <strong>
                  {latestAssessment.percentage}%
                </strong>

                <span>
                  Current Score
                </span>

              </div>

            </div>

          ) : (

            <div className="empty-state">

              <h3>
                Start your learning journey
              </h3>

              <p>
                Complete a skill assessment to get
                personalized learning recommendations.
              </p>

              <button
                className="primary-button"
                onClick={onSkillAssessment}
              >
                Start Assessment
              </button>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;