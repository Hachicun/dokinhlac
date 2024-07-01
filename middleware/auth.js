// middleware/auth.js
import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from './initFirebaseAdmin';

initFirebaseAdmin();

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}
