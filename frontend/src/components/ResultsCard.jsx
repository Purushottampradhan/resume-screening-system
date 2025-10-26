import React from 'react';
import '../styles/result_card.css';

function ResultsCard({ resume, onDelete }) {
    const getScoreColor = (score) => {
        if (score >= 80) return '#27ae60';
        if (score >= 60) return '#f39c12';
        return '#e74c3c';
    };

    const ScoreBar = ({ label, score }) => (
        <div className="score-item">
            <label>{label}</label>
            <div className="score-bar-container">
                <div
                    className="score-bar"
                    style={{
                        width: `${score}%`,
                        backgroundColor: getScoreColor(score)
                    }}
                ></div>
                <span className="score-value">{score}%</span>
            </div>
        </div>
    );

    return (
        <div className="results-card">
            <div className="card-header">
                <h3>{resume.filename}</h3>
                <button
                    onClick={() => onDelete(resume.id)}
                    className="delete-btn"
                >
                    🗑️ Delete
                </button>
            </div>

            <div className="scores-grid">
                <ScoreBar label="AI/ML Match" score={resume.scores.ai_ml_match} />
                <ScoreBar label="LLM Match" score={resume.scores.llm_match} />
                <ScoreBar label="Python Match" score={resume.scores.python_match} />
                <ScoreBar label="5+ Years Exp" score={resume.scores.experience_match} />
            </div>

            <div className="overall-score">
                <div className="overall-label">Overall Score</div>
                <div
                    className="overall-value"
                    style={{ color: getScoreColor(resume.overall_score) }}
                >
                    {resume.overall_score}%
                </div>
            </div>
        </div>
    );
}

export default ResultsCard;