import React, { useEffect, useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import { ResumeContext } from '../context/ResumeContext';
import '../styles/results.css';

function ResultsPage() {
    const { resumes, loading, fetchResumes, deleteResume } = useContext(ResumeContext);
    const [sortConfig, setSortConfig] = useState({ key: 'overall_score', direction: 'desc' });

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    const getSortedResumes = () => {
        let sorted = [...resumes];
        sorted.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (sortConfig.key.includes('scores.')) {
                const scoreKey = sortConfig.key.split('.')[1];
                aVal = a.scores[scoreKey];
                bVal = b.scores[scoreKey];
            }

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        });
        return sorted;
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#27ae60';
        if (score >= 60) return '#f39c12';
        return '#e74c3c';
    };

    const ScoreCell = ({ score }) => (
        <div className="score-cell">
            <div
                className="score-bar"
                style={{
                    width: `${score}%`,
                    backgroundColor: getScoreColor(score)
                }}
            ></div>
            <span className="score-text">{score}%</span>
        </div>
    );

    return (
        <div className="results-page">
            <Navbar />
            <div className="container">
                <h2>📈 Resume Analysis Results</h2>

                {loading ? (
                    <p className="loading">Loading...</p>
                ) : resumes.length === 0 ? (
                    <p className="no-data">No results yet</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('filename')}>Candidate</th>
                                    <th onClick={() => handleSort('scores.ai_ml_match')}>AI/ML Match</th>
                                    <th onClick={() => handleSort('scores.llm_match')}>LLM Match</th>
                                    <th onClick={() => handleSort('scores.python_match')}>Python Match</th>
                                    <th onClick={() => handleSort('scores.experience_match')}>5+ Years</th>
                                    <th onClick={() => handleSort('overall_score')}>Overall</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getSortedResumes().map(resume => (
                                    <tr key={resume.id}>
                                        <td>{resume.filename}</td>
                                        <td><ScoreCell score={resume.scores.ai_ml_match} /></td>
                                        <td><ScoreCell score={resume.scores.llm_match} /></td>
                                        <td><ScoreCell score={resume.scores.python_match} /></td>
                                        <td><ScoreCell score={resume.scores.experience_match} /></td>
                                        <td className="overall">
                                            <ScoreCell score={resume.overall_score} />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => deleteResume(resume.id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultsPage;