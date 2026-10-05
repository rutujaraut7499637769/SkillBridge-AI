import "./Dashboard.css";
import SkillAssessment from "./SkillAssessment";

function Dashboard({ onSkillAssessment }) {
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

          <button className="menu-item">
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

          <div className="overview-card">
            <span>Overall Progress</span>
            <h2>0%</h2>
            <p>Start your first assessment</p>
          </div>

          <div className="overview-card">
            <span>Skills Assessed</span>
            <h2>0</h2>
            <p>No assessment completed</p>
          </div>

          <div className="overview-card">
            <span>Learning Streak</span>
            <h2>0 Days</h2>
            <p>Start learning today</p>
          </div>

        </div>

        {/* Assessment Section */}
        <div className="dashboard-section">

          <h2>Start Your Skill Assessment</h2>

          <p>
            Take an assessment to identify your strengths,
            competency gaps and personalized learning path.
          </p>

          <button
            className="primary-button"
            onClick={onSkillAssessment}
          >
            Start Assessment
          </button>

        </div>

        {/* Recommended Learning */}
        <div className="dashboard-section">

          <h2>Recommended Learning</h2>

          <p>
            Your personalized recommendations will appear
            here after completing the assessment.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;