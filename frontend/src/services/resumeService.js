import api from './api';

export const resumeService = {
    upload: (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return api.post('/resumes/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    
    getAll: () =>
        api.get('/resumes'),
    
    getById: (id) =>
        api.get(`/resumes/${id}`),
    
    delete: (id) =>
        api.delete(`/resumes/${id}`),
    
    deleteBatch: (ids) =>
        api.post('/resumes/batch/delete', { resume_ids: ids }),
    
    clearAll: () =>
        api.delete('/resumes/clear-all')
};