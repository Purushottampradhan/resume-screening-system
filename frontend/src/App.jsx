import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ResumeProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                        />
                        <Route
                            path="/results"
                            element={<ProtectedRoute><ResultsPage /></ProtectedRoute>}
                        />
                        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    </Routes>
                </ResumeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;