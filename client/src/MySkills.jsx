import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./MySkills.css";

function MySkills({ onBack, onLearningRoadmap }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token");

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
      console.log("Error fetching skills:", error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const latestSkills = useMemo(() => {
    const uniqueSkills = [];

    assessments.forEach((assessment) => {
      if (!uniqueSkills.some((item) => item.skill === assessment.skill)) {
        uniqueSkills.push(assessment);
      }
    });

    return uniqueSkills;
  }, [assessments]);

  const averageScore =
    latestSkills.length > 0
      ? Math.round(
          latestSkills.reduce(
            (total, skill) => total + skill.percentage,
            0
          ) / latestSkills.length
        )
      : 0;

  const strongestSkill =
    latestSkills.length > 0
      ? latestSkills.reduce((best, current) =>
          current.percentage > best.percentage ? current : best
        )
      : null;

  const getLevelClass = (level) => {
    if (level === "Advanced") return "advanced";
    if (level === "Strong") return "strong";
    if (level === "Average") return "average";
    return "needs-improvement";
  };

  return (
    <div className="my-skills-page">

      <div className="my-skills-container">

        <div className="my-skills-header">

          <button
            className="dashboard-back"
            onClick={onBack}
            aria-label="Back"
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

            <p>
              Analyzing your skill profile...
            </p>

          </div>

        ) : latestSkills.length === 0 ? (

          <div className="skills-empty">

            <div className="empty-icon">
              ◎
            </div>

            <h2>
              Build Your Skill Profile
            </h2>

            <p>
              Complete your first skill assessment to start
              building your personalized competency profile.
            </p>

            <button
              className="empty-action"
              onClick={onBack}
            >
              Go to Assessment →
            </button>

          </div>

        ) : (

          <>
            <div className="skills-summary">

              <div className="summary-card">

                <div className="summary-icon">
                  ◎
                </div>

                <div>
                  <span>
                    Average Competency
                  </span>

                  <strong>
                    {averageScore}%
                  </strong>
                </div>

              </div>


              <div className="summary-card">

                <div className="summary-icon">
                  ✓
                </div>

                <div>
                  <span>
                    Skills Assessed
                  </span>

                  <strong>
                    {latestSkills.length}
                  </strong>
                </div>

              </div>


              <div className="summary-card">

                <div className="summary-icon">
                  ★
                </div>

                <div>
                  <span>
                    Strongest Skill
                  </span>

                  <strong>
                    {strongestSkill
                      ? strongestSkill.skill
                      : "—"}
                  </strong>
                </div>

              </div>

            </div>


            {/* COMPETENCY PROFILE */}
            <div className="skills-section">

              <div className="skills-section-header">

                <div>
                  <h2>
                    Competency Profile
                  </h2>

                  <p>
                    Your latest assessment results across different skills.
                  </p>
                </div>

                <span className="skills-count">
                  {latestSkills.length} Skills
                </span>

              </div>


              <div className="my-skills-grid">

                {latestSkills.map((assessment) => (

                  <div
                    className="my-skill-card"
                    key={assessment._id}
                  >

                    <div className="skill-card-header">

                      <div className="skill-title">

                        <h3>
                          {assessment.skill}
                        </h3>

                        <span className="assessment-date">
                          Latest assessment
                        </span>

                      </div>

                      <span
                        className={`skill-level ${getLevelClass(
                          assessment.level
                        )}`}
                      >
                        {assessment.level}
                      </span>

                    </div>


                    <div className="skill-score-row">

                      <div>

                        <span className="score-label">
                          Competency Score
                        </span>

                        <strong className="skill-percentage">
                          {assessment.percentage}%
                        </strong>

                      </div>

                      <span className="question-score">
                        {assessment.score} / 5
                      </span>

                    </div>


                    <div className="skill-progress-track">

                      <div
                        className={`skill-progress-fill ${getLevelClass(
                          assessment.level
                        )}`}
                        style={{
                          width: `${assessment.percentage}%`
                        }}
                      ></div>

                    </div>


                    <div className="skill-card-footer">

                      <span>
                        {assessment.level === "Advanced"
                          ? "Excellent competency"
                          : assessment.level === "Strong"
                          ? "Good competency"
                          : assessment.level === "Average"
                          ? "Room for improvement"
                          : "Needs focused learning"}
                      </span>

                      <span>
                        Latest result
                      </span>

                    </div>
                    <button
                      className="View-roadmap-button"
                      onClick={() => onLearningRoadmap(assessment.skill)}
                    >
                      View Learning Roadmap →
                    </button>
                  </div>

                ))}

              </div>

            </div>


            {/* INSIGHT */}
            <div className="skills-insight">

              <div className="insight-icon">
                ✦
              </div>

              <div>

                <h3>
                  SkillBridge Insight
                </h3>

                <p>
                  Your competency profile will be used to identify
                  skill gaps and generate a personalized learning roadmap.
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