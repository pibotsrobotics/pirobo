import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to detect if we are using the Mock Auth System
    const isMockAuth = auth && typeof auth.signInWithEmailAndPassword === 'function' && !auth.app;

    useEffect(() => {
        let unsubscribe;

        if (isMockAuth) {
            // Mock System: Use the custom onAuthStateChanged attached to the object
            // This runs once on mount to get initial user
            unsubscribe = auth.onAuthStateChanged((user) => {
                setCurrentUser(user);
                setLoading(false);
            });
        } else {
            // Real Firebase: Use the SDK function
            try {
                unsubscribe = onAuthStateChanged(auth, (user) => {
                    setCurrentUser(user);
                    setLoading(false);
                });
            } catch (err) {
                console.error("Auth Listener Error:", err);
                setLoading(false);
            }
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isMockAuth]);

    const login = async (email, password) => {
        if (isMockAuth) {
            // Mock System: Call the method directly on the object
            const result = await auth.signInWithEmailAndPassword(auth, email, password);
            // CRITICAL: Manually update state because Mock doesn't carry an event listener for "login success"
            setCurrentUser(result.user);
            return result;
        }
        // Real Firebase: Use SDK function
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        if (isMockAuth) {
            // Mock System: Call the method directly
            await auth.signOut();
            // CRITICAL: Manually update state
            setCurrentUser(null);
            return;
        }
        // Real Firebase: Use SDK function
        return signOut(auth);
    };

    const value = {
        currentUser,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
