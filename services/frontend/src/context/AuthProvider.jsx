import { useState, useEffect } from 'react';
import { authAPI } from '../api/client';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                const response = await authAPI.me();
                if (isMounted) {
                    setUser(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { user: userData, token } = response.data;
        const accessToken = token;
        const refreshToken = token; // Temporary fallback as backend doesn't send refresh token yet

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);

        return userData;
    };

    const signup = async (email, password, firstName, lastName) => {
        const response = await authAPI.signup({ email, password, firstName, lastName });
        const { user: userData, accessToken, refreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);

        return userData;
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await authAPI.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
