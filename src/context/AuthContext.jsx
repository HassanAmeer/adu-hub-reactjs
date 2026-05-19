import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { dbService } from '../services/dbService';
import { COLLECTIONS, ROLES } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Fetch Firestore profile using email as document ID ─────────────────────
  const fetchProfile = async (email) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === 'dev@gmail.com') {
        const todayDate = String(new Date().getDate());
        return {
          id: 'dev@gmail.com',
          email: 'dev@gmail.com',
          name: 'Developer Mode',
          role: 'superadmin',
          password: todayDate,
          isDev: true
        };
      }
      const ref = doc(db, COLLECTIONS.USERS, cleanEmail);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = { id: cleanEmail, ...snap.data() };
        
        // Sync to local storage database list for compatibility with list views
        try {
          const users = dbService.getUsers();
          const idx = users.findIndex(u => u.id === cleanEmail);
          const syncedUser = {
            ...data,
            joinedDate: data.joinedDate || new Date().toISOString().split('T')[0]
          };
          if (idx !== -1) {
            users[idx] = syncedUser;
          } else {
            users.push(syncedUser);
          }
          dbService.saveUsers(users);
        } catch (err) {
          console.error("Local user list sync error:", err);
        }
        
        return data;
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
    return null;
  };

  // ─── SIGN UP ─────────────────────────────────────────────────────────────
  const signup = async (email, password, name = '', role = ROLES.HOMEOWNER) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user already exists in Firestore
    const ref = doc(db, COLLECTIONS.USERS, cleanEmail);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const err = new Error('Account already exists');
      err.code = 'auth/email-already-in-use';
      throw err;
    }

    // 2. Build profile containing password directly
    const profile = {
      name: name.trim() || email.split('@')[0],
      email: cleanEmail,
      password: password, // Store in Firestore only
      role,               // homeowner | professional | investor
      status: 'active',
      subscription: 'free',
      savedProperties: [],
      savedPros: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // 3. Save profile to Firestore /users/{cleanEmail}
    await setDoc(ref, profile);

    const full = { id: cleanEmail, ...profile };
    
    // Sync locally
    try {
      const users = dbService.getUsers();
      const idx = users.findIndex(u => u.id === cleanEmail);
      if (idx !== -1) {
        users[idx] = full;
      } else {
        users.push(full);
      }
      dbService.saveUsers(users);
    } catch (err) {
      console.error("Local list sync error during signup:", err);
    }

    setCurrentUser(full);
    localStorage.setItem('adu-hub-user-email', cleanEmail);
    return full;
  };

  // ─── LOG IN ───────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check static credentials for dev
    if (cleanEmail === 'dev@gmail.com') {
      const todayDate = String(new Date().getDate());
      if (password === todayDate) {
        const devUser = {
          id: 'dev@gmail.com',
          email: 'dev@gmail.com',
          name: 'Developer Mode',
          role: 'superadmin',
          password: todayDate,
          isDev: true
        };
        setCurrentUser(devUser);
        localStorage.setItem('adu-hub-user-email', 'dev@gmail.com');
        return devUser;
      } else {
        const err = new Error('Incorrect password');
        err.code = 'auth/wrong-password';
        throw err;
      }
    }

    // 1. Fetch user from Firestore
    const profile = await fetchProfile(cleanEmail);
    if (!profile) {
      const err = new Error('No account found with this email');
      err.code = 'auth/user-not-found';
      throw err;
    }

    // 2. Validate password
    if (profile.password !== password) {
      const err = new Error('Incorrect password');
      err.code = 'auth/wrong-password';
      throw err;
    }

    setCurrentUser(profile);
    localStorage.setItem('adu-hub-user-email', cleanEmail);
    return profile;
  };

  // ─── LOG OUT ──────────────────────────────────────────────────────────────
  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('adu-hub-user-email');
  };

  // ─── REFRESH USER PROFILE ─────────────────────────────────────────────────
  const refreshUser = async () => {
    if (currentUser) {
      const profile = await fetchProfile(currentUser.email);
      if (profile) setCurrentUser(profile);
    }
  };

  // ─── AUTH STATE LISTENER ─────────────────────────────────────────────────
  useEffect(() => {
    const checkSession = async () => {
      const savedEmail = localStorage.getItem('adu-hub-user-email');
      if (savedEmail) {
        const profile = await fetchProfile(savedEmail);
        if (profile) {
          setCurrentUser(profile);
        } else {
          localStorage.removeItem('adu-hub-user-email');
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
