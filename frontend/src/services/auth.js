// src/services/auth.js
/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */

const AuthService = {
    /**
     * Sign up a new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Returns the API response
     */
    signUp: async (email, password) => {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }

        return data;
    },

    /**
     * Login a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Returns the API response with user and token
     */
    login: async (email, password) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store authentication data
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    /**
     * Logout the current user
     * @returns {Promise} - Returns the API response
     */
    logout: async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Clear local storage regardless of server response
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Return the response data if needed
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage on error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Get the current authenticated user
     * @returns {Object|null} - Returns the user object or null if not authenticated
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Get the authentication token
     * @returns {string|null} - Returns the token or null if not authenticated
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} - Returns true if authenticated, false otherwise
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export default AuthService;
