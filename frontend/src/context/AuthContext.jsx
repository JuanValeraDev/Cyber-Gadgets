// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = () => {
            const storedToken = AuthService.getToken();
            const storedUser = AuthService.getCurrentUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        const data = await AuthService.login(email, password);
        setUser(data.user);
        setToken(data.session.access_token);
        return data;
    };

    // Register function
    const register = async (email, password) => {
        return await AuthService.signUp(email, password);
    };

    // Logout function
    const logout = async () => {
        await AuthService.logout();
        setUser(null);
        setToken(null);
    };

    // Context value
    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
