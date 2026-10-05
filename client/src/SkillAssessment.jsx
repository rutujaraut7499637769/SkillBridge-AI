import { useState } from "react";
import "./SkillAssessment.css";
import AssessmentQuestions from "./AssessmentQuestions";

function SkillAssessment({onBack}) {
  const [selectedSkill, setSelectedSkill] = useState("");
  const[assessmentStarted, setAssessmentStarted] = useState(false);

  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "SQL",
    "Git",
    "Programming Fundamentals"
  ];

  if (assessmentStarted) {
  return (
    <AssessmentQuestions
      skill={selectedSkill}
      onBack={() => setAssessmentStarted(false)}
    />
  );
}
  return (
    <div className="assessment-page">

      <div className="assessment-header">
        <h1>Skill Assessment</h1>

        <p>
          Select the skill you want to assess and start your
          personalized competency assessment.
        </p>
      </div>

      <div className="assessment-card">
<button
          className="back-button"
          onClick={onBack}
        >
          &larr;
        </button>
        <h2>Choose Your Skill</h2>

        <p className="assessment-description">
          This assessment will help SkillBridge AI understand
          your current skill level and identify areas for improvement.
        </p>

        <label>Select Skill</label>

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">Choose a skill</option>

          {skills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>

        <button
          className="start-assessment-button"
          disabled={!selectedSkill}
          onClick={() => setAssessmentStarted(true)}
        >
          Start Assessment
        </button>

      </div>

    </div>
  );
}

export default SkillAssessment;