
// src/services/user.js
/**
 * User Service
 * Handles user profile API calls
 */

import AuthService from './auth';

const UserService = {
    /**
     * Get the current user's profile
     * @returns {Promise} - Returns the API response with profile data
     */
    getProfile: async () => {
        const token = AuthService.getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch profile');
        }

        return data;
    },

    /**
     * Update the current user's profile
     * @param {Object} profileData - Profile data to update
     * @returns {Promise} - Returns the API response
     */
    updateProfile: async (profileData) => {
        const token = AuthService.getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile');
        }

        return data;
    },
};

export default UserService;
