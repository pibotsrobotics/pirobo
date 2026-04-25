import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let auth;
let db;
let storage;

try {
    // Try to initialize only if keys seem present-ish (basic check)
    if (!firebaseConfig.apiKey) throw new Error("Missing API Key");

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.warn("Firebase Config Missing/Invalid. Using MOCK Authentication for Demo.", error);

    // --- MOCK AUTHENTICATION SYSTEM ---

    const MOCK_USER = {
        uid: "mock-admin-id",
        email: "admin@pibots.in",
        displayName: "Admin User",
        emailVerified: true
    };

    // Simple Session Storage Mock
    const getSessionUser = () => {
        const stored = sessionStorage.getItem('mock_auth_user');
        return stored ? JSON.parse(stored) : null;
    };

    auth = {
        currentUser: getSessionUser(),
        onAuthStateChanged: (callback) => {
            // Trigger immediately with current state
            callback(getSessionUser());
            // Return unsubscribe function
            return () => { };
        },
        signInWithEmailAndPassword: (authInstance, email, password) => {
            return new Promise((resolve, reject) => {
                // HARDCODED CREDENTIALS FOR DEMO
                if (email === "admin@pibots.in" && password === "admin123") {
                    sessionStorage.setItem('mock_auth_user', JSON.stringify(MOCK_USER));
                    auth.currentUser = MOCK_USER;
                    // NO RELOAD - handled by Context
                    resolve({ user: MOCK_USER });
                } else {
                    reject(new Error("Invalid email or password (Try: admin@pibots.in / admin123)"));
                }
            });
        },
        signOut: () => {
            return new Promise((resolve) => {
                sessionStorage.removeItem('mock_auth_user');
                auth.currentUser = null;
                // NO RELOAD - handled by Context
                resolve();
            });
        }
    };

    app = {};
    db = {};
    storage = {};
}

export { auth, db, storage };
export default app;
