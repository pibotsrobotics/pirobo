const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
// In production, use service account credentials securely
// For now, we'll verify if default app is already initialized
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            // databaseURL: "https://your-project-id.firebaseio.com" 
        });
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { admin, db, auth, storage };
