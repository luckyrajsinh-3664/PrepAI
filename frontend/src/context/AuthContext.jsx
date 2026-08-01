import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safe initial user state recovery
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e);
      localStorage.removeItem('user');
    }
    return null;
  });

  // Safe token recovery
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken && savedToken !== 'undefined' && savedToken !== 'null' ? savedToken : null;
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Updated login helper supporting user + token payload
  const login = (payload, explicitToken) => {
    const extractedToken = explicitToken || payload?.token || payload?.jwt;
    const extractedUser = payload?.user || (payload?.token ? { ...payload, token: undefined } : payload);

    if (extractedUser) {
      setUser(extractedUser);
      localStorage.setItem('user', JSON.stringify(extractedUser));
    }

    if (extractedToken) {
      setToken(extractedToken);
      localStorage.setItem('token', extractedToken);
    }
  };

  // Helper for cleanly updating user profile fields
  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      const newUserData = { ...prevUser, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(newUserData));
      return newUserData;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};