import admin from 'firebase-admin';

let adminDb = null;
let adminInstance = null;

const hasCredentials = process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;

if (hasCredentials) {
  try {
    if (!admin.apps.length) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      adminInstance = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || 'helbeku',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID || 'helbeku'}.firebaseio.com`,
      });
      console.log('Firebase Admin SDK initialized successfully with service credentials.');
    } else {
      adminInstance = admin.app();
    }
    adminDb = adminInstance.database();
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
  }
} else {
  if (typeof window === 'undefined') {
    console.warn(
      '⚠️ FIREBASE WARNING:\n' +
      'Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY environment variables.\n' +
      'Server-side matchmaking Routes (/api/match/join) will fail until credentials are set in .env.local.'
    );
  }
}

export { adminDb, admin };
