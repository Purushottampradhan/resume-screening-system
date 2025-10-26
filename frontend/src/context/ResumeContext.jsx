import React, { createContext, useState, useCallback } from 'react';
import { resumeService } from '../services/resumeService';

export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchResumes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await resumeService.getAll();
            setResumes(response.data.resumes);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch resumes');
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadResumes = useCallback(async (files) => {
        try {
            setLoading(true);
            setError(null);
            const response = await resumeService.upload(files);
            await fetchResumes();
            return response.data;
        } catch (err) {
            const message = err.response?.data?.error || 'Upload failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchResumes]);

    const deleteResume = useCallback(async (id) => {
        try {
            await resumeService.delete(id);
            setResumes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            setError(err.response?.data?.error || 'Delete failed');
            throw err;
        }
    }, []);

    const deleteBatchResumes = useCallback(async (ids) => {
        try {
            await resumeService.deleteBatch(ids);
            setResumes(prev => prev.filter(r => !ids.includes(r.id)));
        } catch (err) {
            setError(err.response?.data?.error || 'Batch delete failed');
            throw err;
        }
    }, []);

    const clearAll = useCallback(async () => {
        try {
            await resumeService.clearAll();
            setResumes([]);
        } catch (err) {
            setError(err.response?.data?.error || 'Clear failed');
            throw err;
        }
    }, []);

    const value = {
        resumes,
        loading,
        error,
        fetchResumes,
        uploadResumes,
        deleteResume,
        deleteBatchResumes,
        clearAll
    };

    return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};