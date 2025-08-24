import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('quizUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('quizAccessToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('quizRefreshToken'));

  // Save tokens and user to localStorage
  const saveAuth = (userData, access, refresh) => {
    localStorage.setItem('quizUser', JSON.stringify(userData));
    localStorage.setItem('quizAccessToken', access);
    localStorage.setItem('quizRefreshToken', refresh);
    setUser(userData);
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  // Login function with error handling
  const login = async ({ username, password }) => {
    try {
      const res = await api.post('/users/login/', { username, password });
      const { access, refresh } = res.data;
      const userRes = await api.get('/users/profile/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      saveAuth(userRes.data, access, refresh);
    } catch (error) {
      // You can customize error handling here or rethrow for UI to catch
      throw error;
    }
  };

  // Signup function with error handling
  const signup = async ({ username, email, password }) => {
    try {
      await api.post('/users/register/', { username, email, password });
    } catch (error) {
      // Customize error handling or rethrow for UI
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('quizUser');
    localStorage.removeItem('quizAccessToken');
    localStorage.removeItem('quizRefreshToken');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  // Optional: Add auto-login on app mount by validating stored tokens.
  // For basic functionality, simply loading tokens/user from localStorage as done above is sufficient.

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        signup,
        logout,
        setUser,
        setAccessToken,
        setRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
