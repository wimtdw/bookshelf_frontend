import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('access_token')
    );
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const fetchUser = useCallback(async () => {
        try {
            const response = await axiosInstance.get('auth/users/me/');
            setUser(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const login = useCallback(async () => {
        setIsAuthenticated(true);
        await fetchUser();
    }, [setIsAuthenticated, fetchUser]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, fetchUser]);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('access_token'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);