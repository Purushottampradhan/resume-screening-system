import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import { tokenManager } from '../utils/tokenManager';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            if (tokenManager.hasToken()) {
                try {
                    const response = await authService.getCurrentUser();
                    setUser(response.data);
                } catch (err) {
                    tokenManager.clearTokens();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const signup = useCallback(async (email, password, name) => {
        try {
            setError(null);
            const response = await authService.signup(email, password, name);
            tokenManager.setAccessToken(response.data.access_token);
            tokenManager.setRefreshToken(response.data.refresh_token);
            setUser(response.data.user);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.error || 'Signup failed';
            setError(message);
            throw err;
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            setError(null);
            const response = await authService.login(email, password);
            tokenManager.setAccessToken(response.data.access_token);
            tokenManager.setRefreshToken(response.data.refresh_token);
            setUser(response.data.user);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.error || 'Login failed';
            setError(message);
            throw err;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            tokenManager.clearTokens();
            setUser(null);
        }
    }, []);

    const value = {
        user,
        loading,
        error,
        signup,
        login,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};