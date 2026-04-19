const admin = require('firebase-admin');
require('dotenv').config({ path: './.env' }); // Assuming backend/.env exists with correct Firebase credentials if any, otherwise default app

// Initialize Firebase Admin with default credentials if running locally
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

const db = admin.firestore();

async function clearMockData() {
    try {
        console.log('Fetching mock events...');
        const eventsSnapshot = await db.collection('events').get();
        const mockEventTitles = ['Robotics Workshop 2024', 'AI Hackathon', 'IoT Seminar'];
        let deletedEvents = 0;
        eventsSnapshot.forEach(async (doc) => {
            const data = doc.data();
            if (mockEventTitles.includes(data.title)) {
                await doc.ref.delete();
                deletedEvents++;
                console.log(`Deleted mock event: ${data.title}`);
            }
        });

        console.log('Fetching mock courses...');
        const coursesSnapshot = await db.collection('courses').get();
        const mockCourseTitles = ['Robotics for Beginners', 'Advanced AI & ML', 'Web Development Bootcamp'];
        let deletedCourses = 0;
        coursesSnapshot.forEach(async (doc) => {
            const data = doc.data();
            if (mockCourseTitles.includes(data.title)) {
                await doc.ref.delete();
                deletedCourses++;
                console.log(`Deleted mock course: ${data.title}`);
            }
        });

        console.log('Done cleaning up mock data.');
    } catch (error) {
        console.error('Error cleaning up mock data:', error);
    }
}

clearMockData();
