import { useState } from "react";
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

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://https://skillbridge-ai-1-s5wk.onrender.com//signup",
        {
          name,
          email,
          password
        }
      );

      alert(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setIsLogin(true);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Signup failed"
      );
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://https://skillbridge-ai-1-s5wk.onrender.com//login",
        {
          email: loginEmail,
          password: loginPassword
        }
      );

      alert(response.data.message);

      localStorage.setItem(
        "token",
        response.data.token
      );

      setIsLoggedIn(true);
      setCurrentPage("dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setCurrentPage("dashboard");
    setSelectedSkill("");

    setLoginEmail("");
    setLoginPassword("");

    alert("Logged out successfully");
  };


  if (isLoggedIn) {
    let currentContent;

    if (currentPage === "assessment") {
      currentContent = (
        <SkillAssessment
          onBack={() => setCurrentPage("dashboard")}
        />
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
        <Progress
          onBack={() => setCurrentPage("dashboard")}
        />
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
          onSkillAssessment={() =>
            setCurrentPage("assessment")
          }
          onMySkills={() =>
            setCurrentPage("mySkills")
          }
          onLearningRoadmap={(skill) => {
            setSelectedSkill(skill);
            setCurrentPage("learningRoadmap");
          }}
          onQuiz={() =>
            setCurrentPage("quiz")
          }
          onProgress={() =>
            setCurrentPage("progress")
          }
          onProfile={() =>
            setCurrentPage("profile")
          }
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
          <div className="brand-icon">
            SB
          </div>

          <h1>SkillBridge-AI</h1>

          <p>
            Learn smarter. Build stronger skills.
          </p>
        </div>

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
          <form
            onSubmit={handleLogin}
            className="auth-form"
          >
            <h2>Welcome Back 👋</h2>

            <p className="form-subtitle">
              Login to continue your learning journey.
            </p>

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) =>
                setLoginEmail(e.target.value)
              }
              required
            />

            <label>Password</label>

            <div className="password-box">
              <input
                type={
                  showLoginPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowLoginPassword(
                    !showLoginPassword
                  )
                }
              >
                {showLoginPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="main-button"
            >
              Login
            </button>

            <p className="switch-text">
              Don't have an account?{" "}
              <span
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </span>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleSignup}
            className="auth-form"
          >
            <h2>Create Account ✨</h2>

            <p className="form-subtitle">
              Start your personalized learning journey.
            </p>

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label>Password</label>

            <div className="password-box">
              <input
                type={
                  showSignupPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowSignupPassword(
                    !showSignupPassword
                  )
                }
              >
                {showSignupPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <label>Confirm Password</label>

            <div className="password-box">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="main-button"
            >
              Create Account
            </button>

            <p className="switch-text">
              Already have an account?{" "}
              <span
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}

export default App;