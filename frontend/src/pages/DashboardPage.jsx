import React, { useEffect, useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import { ResumeContext } from '../context/ResumeContext';
import '../styles/dashboard.css';

function DashboardPage() {
    const { resumes, loading, fetchResumes, deleteResume, deleteBatchResumes, clearAll } = useContext(ResumeContext);
    const [sortConfig, setSortConfig] = useState({ key: 'overall_score', direction: 'desc' });
    const [selectedIds, setSelectedIds] = useState([]);

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

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(resumes.map(r => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Delete ${selectedIds.length} resume(s)?`)) {
            await deleteBatchResumes(selectedIds);
            setSelectedIds([]);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('Delete all resumes?')) {
            await clearAll();
            setSelectedIds([]);
        }
    };

    return (
        <div className="dashboard">
            <Navbar />
            <div className="container">
               <UploadForm onUploadSuccess={fetchResumes} />

                <div className="results-section">
                    <div className="results-header">
                        <h2>📊 Analysis Results</h2>
                        <div className="header-actions">
                            {resumes.length > 0 && (
                                <>
                                    {selectedIds.length > 0 && (
                                        <span className="selected-count">{selectedIds.length} selected</span>
                                    )}
                                    {selectedIds.length > 0 && (
                                        <button 
                                            onClick={handleDeleteSelected} 
                                            className="delete-selected-btn"
                                        >
                                            Delete Selected
                                        </button>
                                    )}
                                    <button onClick={handleClearAll} className="clear-btn">
                                        Clear All
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <p className="loading">Loading resumes...</p>
                    ) : resumes.length === 0 ? (
                        <p className="no-data">No resumes yet. Upload some to get started!</p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th className="checkbox-col">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.length === resumes.length && resumes.length > 0}
                                                onChange={handleSelectAll}
                                                title="Select all"
                                            />
                                        </th>
                                        <th onClick={() => handleSort('filename')} className="sortable">
                                            Candidate {sortConfig.key === 'filename' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th onClick={() => handleSort('scores.ai_ml_match')} className="sortable">
                                            AI/ML Match (%) {sortConfig.key === 'scores.ai_ml_match' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th onClick={() => handleSort('scores.llm_match')} className="sortable">
                                            LLM Match (%) {sortConfig.key === 'scores.llm_match' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th onClick={() => handleSort('scores.python_match')} className="sortable">
                                            Python Match (%) {sortConfig.key === 'scores.python_match' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th onClick={() => handleSort('scores.experience_match')} className="sortable">
                                            5+ Years Exp (%) {sortConfig.key === 'scores.experience_match' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th onClick={() => handleSort('overall_score')} className="sortable">
                                            Overall Score (%) {sortConfig.key === 'overall_score' && <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSortedResumes().map(resume => (
                                        <tr key={resume.id} className={selectedIds.includes(resume.id) ? 'selected' : ''}>
                                            <td className="checkbox-col">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(resume.id)}
                                                    onChange={() => handleSelectOne(resume.id)}
                                                />
                                            </td>
                                            <td className="candidate-name">{resume.filename}</td>
                                            <td><div className="score-value">{resume.scores.ai_ml_match}%</div></td>
                                            <td><div className="score-value">{resume.scores.llm_match}%</div></td>
                                            <td><div className="score-value">{resume.scores.python_match}%</div></td>
                                            <td><div className="score-value">{resume.scores.experience_match}%</div></td>
                                            <td className="overall-score">
                                                <div className="overall-value" style={{ color: getScoreColor(resume.overall_score) }}>
                                                    {resume.overall_score}%
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => deleteResume(resume.id)}
                                                    className="delete-btn"
                                                >
                                                    🗑️ Delete
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
        </div>
    );
}

export default DashboardPage;