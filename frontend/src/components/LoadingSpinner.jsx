import React from 'react';
import '../styles/spinner.css';

function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p>{message}</p>
        </div>
    );
}

export default LoadingSpinner;