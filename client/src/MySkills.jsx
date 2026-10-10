import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./MySkills.css";

function MySkills({ onBack, onLearningRoadmap }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErrorMessage("Please log in to view your skills.");
          return;
        }

        const response = await axios.get(
          "https://skillbridge-ai-1-s5wk.onrender.com/api/assessment/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        const results = Array.isArray(data)
          ? data
          : Array.isArray(data?.assessments)
          ? data.assessments
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setAssessments(results);
        setErrorMessage("");
      } catch (error) {
        console.error(
          "Error fetching skills:",
          error.response?.data || error.message
        );

        setAssessments([]);
        setErrorMessage(
          error.response?.status === 401
            ? "Your session may have expired. Please log in again."
            : "Unable to load your skills. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const latestSkills = useMemo(() => {
    const uniqueSkills = new Map();

    assessments.forEach((assessment) => {
      if (!assessment?.skill) return;

      const skillKey = assessment.skill.trim().toLowerCase();
      const existing = uniqueSkills.get(skillKey);

      const currentDate = new Date(
        assessment.createdAt || assessment.updatedAt || 0
      ).getTime();

      const existingDate = existing
        ? new Date(
            existing.createdAt || existing.updatedAt || 0
          ).getTime()
        : -1;

      if (!existing || currentDate >= existingDate) {
        uniqueSkills.set(skillKey, assessment);
      }
    });

    return Array.from(uniqueSkills.values());
  }, [assessments]);

  const averageScore =
    latestSkills.length > 0
      ? Math.round(
          latestSkills.reduce(
            (total, skill) =>
              total + (Number(skill.percentage) || 0),
            0
          ) / latestSkills.length
        )
      : 0;

  const strongestSkill =
    latestSkills.length > 0
      ? latestSkills.reduce((best, current) =>
          (Number(current.percentage) || 0) >
          (Number(best.percentage) || 0)
            ? current
            : best
        )
      : null;

  const getLevelClass = (level) => {
    const normalizedLevel = String(level || "")
      .trim()
      .toLowerCase();

    if (normalizedLevel === "advanced") return "advanced";
    if (normalizedLevel === "strong") return "strong";
    if (normalizedLevel === "average") return "average";

    return "needs-improvement";
  };

  const getLevelLabel = (level) => {
    const normalizedLevel = String(level || "")
      .trim()
      .toLowerCase();

    if (normalizedLevel === "advanced") return "Advanced";
    if (normalizedLevel === "strong") return "Strong";
    if (normalizedLevel === "average") return "Average";

    return "Needs Improvement";
  };

  const getCompetencyMessage = (level) => {
    const normalizedLevel = String(level || "")
      .trim()
      .toLowerCase();

    if (normalizedLevel === "advanced") {
      return "Excellent competency";
    }

    if (normalizedLevel === "strong") {
      return "Good competency";
    }

    if (normalizedLevel === "average") {
      return "Room for improvement";
    }

    return "Needs focused learning";
  };

  return (
    <div className="my-skills-page">
      <div className="my-skills-container">
        <div className="my-skills-header">
          <button
            className="dashboard-back"
            onClick={onBack}
            aria-label="Back"
            type="button"
          >
            ←
          </button>

          <span className="page-label">
            SKILLBRIDGE AI • PERSONALIZED LEARNING
          </span>

          <h1>Your Skill Profile</h1>

          <p className="page-description">
            Understand your strengths, track your competency,
            and focus on what to learn next.
          </p>
        </div>

        {loading ? (
          <div className="skills-loading">
            <div className="loading-spinner"></div>
            <p>Analyzing your skill profile...</p>
          </div>
        ) : errorMessage ? (
          <div className="skills-empty">
            <div className="empty-icon">!</div>
            <h2>Unable to Load Skills</h2>
            <p>{errorMessage}</p>

            <button
              className="empty-action"
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : latestSkills.length === 0 ? (
          <div className="skills-empty">
            <div className="empty-icon">◎</div>

            <h2>Build Your Skill Profile</h2>

            <p>
              Complete your first skill assessment to start
              building your personalized competency profile.
            </p>

            <button
              className="empty-action"
              onClick={onBack}
              type="button"
            >
              Go to Assessment →
            </button>
          </div>
        ) : (
          <>
            <div className="skills-summary">
              <div className="summary-card">
                <div className="summary-icon">◎</div>

                <div>
                  <span>Average Competency</span>
                  <strong>{averageScore}%</strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">✓</div>

                <div>
                  <span>Skills Assessed</span>
                  <strong>{latestSkills.length}</strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">★</div>

                <div>
                  <span>Strongest Skill</span>
                  <strong className="strongest-skill-name">
                    {strongestSkill?.skill || "—"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="skills-section">
              <div className="skills-section-header">
                <div>
                  <h2>Competency Profile</h2>

                  <p>
                    Your latest assessment results across different skills.
                  </p>
                </div>

                <span className="skills-count">
                  {latestSkills.length}{" "}
                  {latestSkills.length === 1 ? "Skill" : "Skills"}
                </span>
              </div>

              <div className="my-skills-grid">
                {latestSkills.map((assessment, index) => {
                  const percentage = Math.min(
                    100,
                    Math.max(0, Number(assessment.percentage) || 0)
                  );

                  return (
                    <div
                      className="my-skill-card"
                      key={
                        assessment._id ||
                        `${assessment.skill}-${index}`
                      }
                    >
                      <div className="skill-card-header">
                        <div className="skill-title">
                          <h3>{assessment.skill}</h3>

                          <span className="assessment-date">
                            Latest assessment
                          </span>
                        </div>

                        <span
                          className={`skill-level ${getLevelClass(
                            assessment.level
                          )}`}
                        >
                          {getLevelLabel(assessment.level)}
                        </span>
                      </div>

                      <div className="skill-score-row">
                        <div>
                          <span className="score-label">
                            Competency Score
                          </span>

                          <strong className="skill-percentage">
                            {percentage}%
                          </strong>
                        </div>

                        <span className="question-score">
                          {assessment.score ?? 0} / 5
                        </span>
                      </div>

                      <div
                        className="skill-progress-track"
                        role="progressbar"
                        aria-label={`${assessment.skill} competency`}
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`skill-progress-fill ${getLevelClass(
                            assessment.level
                          )}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      <div className="skill-card-footer">
                        <span>
                          {getCompetencyMessage(assessment.level)}
                        </span>

                        <span>Latest result</span>
                      </div>

                      <button
                        className="view-roadmap-button"
                        type="button"
                        onClick={() =>
                          onLearningRoadmap?.(assessment.skill)
                        }
                      >
                        View Learning Roadmap →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="skills-insight">
              <div className="insight-icon">✦</div>

              <div>
                <h3>SkillBridge Insight</h3>

                <p>
                  Your competency profile will help identify skill
                  gaps and guide your personalized learning roadmap.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MySkills;