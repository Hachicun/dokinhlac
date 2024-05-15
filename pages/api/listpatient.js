//pages/api/listpatient.js
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { user_email } = req.query; // Assume you pass the user email as a query parameter

    if (!user_email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    try {
      const patients = await prisma.patient.findMany({
        where: {
          user_email: user_email
        }
      });
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
