import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser as dbLoginUser, signupUser as dbSignupUser } from '../services/db';
import { CONFIG } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom Firestore-based authentication
  const login = async (email, password) => {
    try {
      const user = await dbLoginUser(email, password);
      setCurrentUser(user);
      localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("AuthContext Login Error:", error);
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const user = await dbSignupUser(email, password, name);
      setCurrentUser(user);
      localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("AuthContext Signup Error:", error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEY);
    return Promise.resolve();
  };

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
