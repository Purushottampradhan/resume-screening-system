import React, { useState } from 'react';
import { resumeService } from '../services/resumeService';
import '../styles/upload.css';

function UploadForm({ onUploadSuccess }) {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            // Convert new FileList to Array and ADD to existing files
            const newFiles = [];
            for (let i = 0; i < e.target.files.length; i++) {
                newFiles.push(e.target.files[i]);
            }
            
            console.log('New files selected:', newFiles.length);
            console.log('Total files now:', files.length + newFiles.length);
            
            newFiles.forEach((file, index) => {
                console.log(`New file ${index + 1}:`, file.name, file.size, file.type);
            });
            
            // ADD to existing files, don't replace
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
            setError('');
            setSuccess('');
        }
    };

    const removeFile = (indexToRemove) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const clearAllFiles = () => {
        setFiles([]);
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            setError('Please select at least one file');
            return;
        }

        try {
            setError('');
            setSuccess('');
            setLoading(true);
            setUploadProgress(10);

            console.log('Starting upload with', files.length, 'files');

            // Create FormData and append each file
            const formData = new FormData();
            
            for (let i = 0; i < files.length; i++) {
                console.log(`Appending file ${i + 1}:`, files[i].name);
                formData.append('files', files[i], files[i].name);
            }

            // Log FormData contents
            console.log('FormData entries:');
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1].name || pair[1]);
            }

            setUploadProgress(30);

            // Call service to upload
            const response = await resumeService.upload(formData);
            console.log('Upload response:', response.data);

            setUploadProgress(70);
            setUploadProgress(100);
            
            setFiles([]);
            setSuccess(`✓ Successfully uploaded and analyzed ${response.data.results.length} file(s)`);
            
            // Clear file input
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.value = '';
            }

            // Notify parent to refresh
            if (onUploadSuccess) {
                onUploadSuccess();
            }

            setTimeout(() => {
                setSuccess('');
                setUploadProgress(0);
            }, 3000);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error || err.message || 'Upload failed');
            setUploadProgress(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFileArray = [];
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                droppedFileArray.push(e.dataTransfer.files[i]);
            }
            console.log('Files dropped:', droppedFileArray.length);
            // ADD to existing files
            setFiles(prevFiles => [...prevFiles, ...droppedFileArray]);
            setError('');
        }
    };

    return (
        <div className="upload-form">
            <div className="upload-box" onDragOver={handleDragOver} onDrop={handleDrop}>
                <div className="upload-icon">📄</div>
                <h2>Upload Resumes</h2>
                <p>Select multiple PDF, DOCX, or TXT files (add one by one or multiple at once)</p>
                
                <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="file-input"
                />

                <p className="drag-hint">or drag and drop files here</p>

                {files && files.length > 0 && (
                    <div className="selected-files">
                        <div className="files-header">
                            <h3>📋 Selected Files ({files.length})</h3>
                            <button 
                                onClick={clearAllFiles}
                                className="clear-list-btn"
                                disabled={loading}
                            >
                                Clear List
                            </button>
                        </div>
                        <div className="file-list">
                            {files.map((file, index) => (
                                <div key={`${file.name}-${index}-${file.size}`} className="file-item">
                                    <span className="file-icon">📑</span>
                                    <div className="file-info">
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="remove-file-btn"
                                        disabled={loading}
                                        title="Remove this file"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="progress-text">{Math.round(uploadProgress)}% Uploading...</p>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button
                    onClick={handleUpload}
                    disabled={loading || !files || files.length === 0}
                    className="upload-btn"
                >
                    {loading ? '⏳ Processing...' : `✈️ Upload & Analyze (${files ? files.length : 0})`}
                </button>
            </div>
        </div>
    );
}

export default UploadForm;