// middleware/initFirebaseAdmin.js
import admin from 'firebase-admin';

const serviceAccount = require('./thietchancra-firebase-adminsdk-sf8zf-6fd12eda72.json'); // Thay đổi đường dẫn này

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
