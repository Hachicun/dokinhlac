import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../lib/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    login: async (email, password) => {
      // Implement login function using Firebase Auth
    },
    logout: async () => {
      // Implement logout function using Firebase Auth
    },
    signup: async (email, password) => {
      // Implement signup function using Firebase Auth
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
