import { useState } from "react";
import axios from "axios";
import "./App.css";
import Dashboard from "./Dashboard";
import SkillAssessment from "./SkillAssessment";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [currentPage, setCurrentPage] = useState("dashboard");
  // Signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/signup",
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

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
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
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  if (isLoggedIn) {
  if (currentPage === "assessment") {
    return (
      <SkillAssessment
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      onSkillAssessment={() => setCurrentPage("assessment")}
    />
  );
}
  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">SB</div>

          <h1>SkillBridge-AI</h1>

          <p>
            Learn smarter. Build stronger skills.
          </p>
        </div>

        {/* Login / Signup Tabs */}
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

        {/* LOGIN */}
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

          /* SIGNUP */
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