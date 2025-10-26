import api from './api';

export const authService = {
    signup: (email, password, name) =>
        api.post('/auth/signup', { email, password, name }),
    
    login: (email, password) =>
        api.post('/auth/login', { email, password }),
    
    refresh: () =>
        api.post('/auth/refresh'),
    
    logout: () =>
        api.post('/auth/logout'),
    
    getCurrentUser: () =>
        api.get('/auth/me')
};