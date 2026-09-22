import { useState, useEffect } from 'react';
import { authAPI } from '../api/client';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem('adminAccessToken');
        if (token) {
            authAPI.me()
                .then(response => {
                    if (!isMounted) return;
                    const userData = response.data.data;
                    if (userData.role !== 'admin') {
                        throw new Error('Access denied: Admin role required');
                    }
                    setUser(userData);
                })
                .catch(error => {
                    console.error('Failed to fetch user:', error);
                    localStorage.removeItem('adminAccessToken');
                    localStorage.removeItem('adminRefreshToken');
                })
                .finally(() => {
                    if (isMounted) setLoading(false);
                });
        } else {
            setLoading(false);
        }
        return () => {
            isMounted = false;
        };
    }, []);

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { user: loggedInUser, token } = response.data;
        const accessToken = token;
        const refreshToken = token; // Temporary fallback

        // Verify user is admin
        if (loggedInUser.role !== 'admin') {
            throw new Error('Access denied: Admin role required');
        }

        localStorage.setItem('adminAccessToken', accessToken);
        localStorage.setItem('adminRefreshToken', refreshToken);
        setUser(loggedInUser);

        return loggedInUser;
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('adminRefreshToken');
            if (refreshToken) {
                await authAPI.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('adminAccessToken');
            localStorage.removeItem('adminRefreshToken');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user && user.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
