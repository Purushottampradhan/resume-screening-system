import { TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants';

export const tokenManager = {
    setAccessToken: (token) => localStorage.setItem(TOKEN_KEY, token),
    getAccessToken: () => localStorage.getItem(TOKEN_KEY),
    setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    clearTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
    hasToken: () => !!localStorage.getItem(TOKEN_KEY)
};