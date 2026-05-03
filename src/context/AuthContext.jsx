import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock login function - allows empty login for design purposes
  const login = (email = 'Guest', password = '') => {
    const user = { 
      email: email || 'guest@example.com', 
      id: 'mock-user-id', 
      displayName: email ? email.split('@')[0] : 'Guest' 
    };
    setCurrentUser(user);
    localStorage.setItem('adu-hub-user', JSON.stringify(user));
    return Promise.resolve(user);
  };

  const signup = (email = 'Guest', password = '', name = 'Guest User') => {
    const user = { 
      email: email || 'guest@example.com', 
      id: 'mock-user-id', 
      displayName: name || 'Guest User' 
    };
    setCurrentUser(user);
    localStorage.setItem('adu-hub-user', JSON.stringify(user));
    return Promise.resolve(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adu-hub-user');
    return Promise.resolve();
  };

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('adu-hub-user');
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
