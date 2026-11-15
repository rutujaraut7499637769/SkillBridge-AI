import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Dashboard from "./Dashboard";
import SkillAssessment from "./SkillAssessment";
import MySkills from "./MySkills";
import LearningRoadmap from "./LearningRoadmap";
import Quiz from "./Quiz";
import Progress from "./Progress";
import Profile from "./Profile";
import Footer from "./Footer";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ADMIN DASHBOARD
function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardRes, usersRes, assessmentsRes, quizzesRes] =
        await Promise.all([
          axios.get("/admin/dashboard"),
          axios.get("/admin/users"),
          axios.get("/admin/assessments"),
          axios.get("/admin/quizzes"),
        ]);

      setStats(dashboardRes.data || {});
      setUsers(
        Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data.users || []
      );
      setAssessments(
        Array.isArray(assessmentsRes.data)
          ? assessmentsRes.data
          : assessmentsRes.data.assessments || []
      );
      setQuizzes(
        Array.isArray(quizzesRes.data)
          ? quizzesRes.data
          : quizzesRes.data.quizzes || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.name || ""} ${user.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/admin/users/${userId}`);
      alert("User deleted successfully.");
      loadAdminData();
    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to delete user."
      );
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers ?? stats.totalUsersCount ?? users.length,
      icon: "👥",
    },
    {
      title: "Total Assessments",
      value: stats.totalAssessments ?? assessments.length,
      icon: "📝",
    },
    {
      title: "Total Quizzes",
      value: stats.totalQuizzes ?? quizzes.length,
      icon: "🎯",
    },
    {
      title: "Total Admins",
      value: stats.totalAdmins ?? 0,
      icon: "🛡️",
    },
  ];

  const adminButtonStyle = (tab) => ({
    padding: "11px 16px",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    background: activeTab === tab ? "#4f46e5" : "#eef2ff",
    color: activeTab === tab ? "#fff" : "#3730a3",
    fontWeight: "600",
    whiteSpace: "nowrap",
  });

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "550px",
  };

  const cellStyle = {
    padding: "13px 12px",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
    fontSize: "13px",
    color: "#374151",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fc",
        padding: "22px",
        color: "#1f2937",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "auto",
        }}
      >
        <header
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: "#3730a3" }}>
              🛡️ SkillBridge-AI Admin
            </h1>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
              Manage users and monitor platform activity
            </p>
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </header>

        <nav
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            margin: "22px 0",
          }}
        >
          <button
            style={adminButtonStyle("overview")}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            style={adminButtonStyle("users")}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            style={adminButtonStyle("assessments")}
            onClick={() => setActiveTab("assessments")}
          >
            Assessments
          </button>

          <button
            style={adminButtonStyle("quizzes")}
            onClick={() => setActiveTab("quizzes")}
          >
            Quizzes
          </button>

          <button
            onClick={loadAdminData}
            style={{
              ...adminButtonStyle("refresh"),
              background: "#059669",
              color: "#fff",
            }}
          >
            ↻ Refresh
          </button>
        </nav>

        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>
            Loading admin dashboard...
          </p>
        ) : error ? (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "16px",
              borderRadius: "10px",
            }}
          >
            {error}
            <button
              onClick={loadAdminData}
              style={{ marginLeft: "12px", cursor: "pointer" }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <>
                <h2>Dashboard Overview</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: "16px",
                    marginTop: "18px",
                  }}
                >
                  {statCards.map((card) => (
                    <div
                      key={card.title}
                      style={{
                        background: "#fff",
                        padding: "22px",
                        borderRadius: "13px",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{ fontSize: "27px" }}>
                        {card.icon}
                      </div>
                      <p style={{ color: "#6b7280", marginBottom: "7px" }}>
                        {card.title}
                      </p>
                      <h2 style={{ margin: 0, color: "#3730a3" }}>
                        {card.value}
                      </h2>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "13px",
                    marginTop: "22px",
                  }}
                >
                  <h3>Recent Users</h3>
                  {users.slice(0, 5).map((user) => (
                    <div
                      key={user._id}
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <strong>{user.name}</strong>
                      <p style={{ margin: "4px 0", color: "#6b7280" }}>
                        {user.email}
                      </p>
                    </div>
                  ))}
                  {users.length === 0 && <p>No users found.</p>}
                </div>
              </>
            )}

            {activeTab === "users" && (
              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "13px",
                }}
              >
                <h2>Manage Users</h2>

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px",
                    margin: "10px 0 18px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                  }}
                />

                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellStyle}>Name</th>
                        <th style={cellStyle}>Email</th>
                        <th style={cellStyle}>Role</th>
                        <th style={cellStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td style={cellStyle}>{user.name}</td>
                          <td style={cellStyle}>{user.email}</td>
                          <td style={cellStyle}>{user.role || "user"}</td>
                          <td style={cellStyle}>
                            {user.role !== "admin" && (
                              <button
                                onClick={() => deleteUser(user._id)}
                                style={{
                                  background: "#fee2e2",
                                  color: "#b91c1c",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "7px 10px",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan="4" style={cellStyle}>
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "assessments" && (
              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "13px",
                }}
              >
                <h2>Assessment Records</h2>

                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellStyle}>Student</th>
                        <th style={cellStyle}>Skill</th>
                        <th style={cellStyle}>Score</th>
                        <th style={cellStyle}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((item) => (
                        <tr key={item._id}>
                          <td style={cellStyle}>
                            {item.user?.name || item.userName || "Student"}
                          </td>
                          <td style={cellStyle}>
                            {item.skill || item.skillName || "-"}
                          </td>
                          <td style={cellStyle}>
                            {item.score ?? item.percentage ?? "-"}
                          </td>
                          <td style={cellStyle}>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                      {assessments.length === 0 && (
                        <tr>
                          <td colSpan="4" style={cellStyle}>
                            No assessment records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "quizzes" && (
              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "13px",
                }}
              >
                <h2>Quiz Records</h2>

                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellStyle}>Student</th>
                        <th style={cellStyle}>Quiz</th>
                        <th style={cellStyle}>Score</th>
                        <th style={cellStyle}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map((item) => (
                        <tr key={item._id}>
                          <td style={cellStyle}>
                            {item.user?.name || item.userName || "Student"}
                          </td>
                          <td style={cellStyle}>
                            {item.skill || item.quizName || "Quiz"}
                          </td>
                          <td style={cellStyle}>
                            {item.score ?? item.percentage ?? "-"}
                          </td>
                          <td style={cellStyle}>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                      {quizzes.length === 0 && (
                        <tr>
                          <td colSpan="4" style={cellStyle}>
                            No quiz records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// MAIN APP
function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedSkill, setSelectedSkill] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });

      alert(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsLogin(true);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem("token", response.data.token);

      setIsLoggedIn(true);
      setIsAdmin(false);
      setCurrentPage("dashboard");
      alert(response.data.message || "Login successful");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/admin/login", {
        email: adminEmail,
        password: adminPassword,
      });

      if (!response.data.token) {
        alert("Admin login failed. Token not received.");
        return;
      }

      localStorage.setItem("token", response.data.token);

      setIsAdmin(true);
      setIsLoggedIn(true);
      setAdminPassword("");

      alert(response.data.message || "Admin login successful");
    } catch (error) {
      alert(error.response?.data?.message || "Admin login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowAdminLogin(false);
    setCurrentPage("dashboard");
    setSelectedSkill("");

    setLoginEmail("");
    setLoginPassword("");
    setAdminEmail("");
    setAdminPassword("");

    alert("Logged out successfully");
  };

  if (isLoggedIn && isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (isLoggedIn) {
    let currentContent;

    if (currentPage === "assessment") {
      currentContent = (
        <SkillAssessment onBack={() => setCurrentPage("dashboard")} />
      );
    } else if (currentPage === "mySkills") {
      currentContent = (
        <MySkills
          onBack={() => setCurrentPage("dashboard")}
          onLearningRoadmap={(skill) => {
            setSelectedSkill(skill);
            setCurrentPage("learningRoadmap");
          }}
        />
      );
    } else if (currentPage === "learningRoadmap") {
      currentContent = (
        <LearningRoadmap
          onBack={() => setCurrentPage("dashboard")}
          selectedSkill={selectedSkill}
        />
      );
    } else if (currentPage === "quiz") {
      currentContent = (
        <Quiz
          onBack={() => setCurrentPage("dashboard")}
          onLearningRoadmap={(skill) => {
            setSelectedSkill(skill);
            setCurrentPage("learningRoadmap");
          }}
        />
      );
    } else if (currentPage === "progress") {
      currentContent = (
        <Progress onBack={() => setCurrentPage("dashboard")} />
      );
    } else if (currentPage === "profile") {
      currentContent = (
        <Profile
          onBack={() => setCurrentPage("dashboard")}
          onLogout={handleLogout}
        />
      );
    } else {
      currentContent = (
        <Dashboard
          onSkillAssessment={() => setCurrentPage("assessment")}
          onMySkills={() => setCurrentPage("mySkills")}
          onLearningRoadmap={(skill) => {
            setSelectedSkill(skill);
            setCurrentPage("learningRoadmap");
          }}
          onQuiz={() => setCurrentPage("quiz")}
          onProgress={() => setCurrentPage("progress")}
          onProfile={() => setCurrentPage("profile")}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <>
        {currentContent}
        <Footer />
      </>
    );
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">SB</div>
          <h1>SkillBridge-AI</h1>
          <p>Learn smarter. Build stronger skills.</p>
        </div>

        {!showAdminLogin ? (
          <>
            <div className="auth-tabs">
              <button
                className={isLogin ? "active-tab" : ""}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>

              <button
                className={!isLogin ? "active-tab" : ""}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="auth-form">
                <h2>Welcome Back 👋</h2>
                <p className="form-subtitle">
                  Login to continue your learning journey.
                </p>

                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />

                <label>Password</label>
                <div className="password-box">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowLoginPassword(!showLoginPassword)
                    }
                  >
                    {showLoginPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <button type="submit" className="main-button">
                  Login
                </button>

                <p className="switch-text">
                  Don't have an account?{" "}
                  <span onClick={() => setIsLogin(false)}>
                    Sign Up
                  </span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="auth-form">
                <h2>Create Account ✨</h2>
                <p className="form-subtitle">
                  Start your personalized learning journey.
                </p>

                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Password</label>
                <div className="password-box">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowSignupPassword(!showSignupPassword)
                    }
                  >
                    {showSignupPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <label>Confirm Password</label>
                <div className="password-box">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <button type="submit" className="main-button">
                  Create Account
                </button>

                <p className="switch-text">
                  Already have an account?{" "}
                  <span onClick={() => setIsLogin(true)}>
                    Login
                  </span>
                </p>
              </form>
            )}

            <div
              style={{
                textAlign: "center",
                marginTop: "22px",
                borderTop: "1px solid #e5e7eb",
                paddingTop: "16px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowAdminLogin(true)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#4f46e5",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                🛡️ Admin Login
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <h2>Admin Login 🛡️</h2>
            <p className="form-subtitle">
              Login to manage SkillBridge-AI platform.
            </p>

            <label>Admin Email</label>
            <input
              type="email"
              placeholder="Enter admin email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />

            <label>Admin Password</label>
            <div className="password-box">
              <input
                type={showAdminPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowAdminPassword(!showAdminPassword)
                }
              >
                {showAdminPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button type="submit" className="main-button">
              Login as Admin
            </button>

            <p className="switch-text">
              <span onClick={() => setShowAdminLogin(false)}>
                ← Back to Student Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;