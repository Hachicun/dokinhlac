import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const { user_email } = req.query;

  if (!user_email) {
    return res.status(400).json({ error: 'User email is required' });
  }

  try {
    const patients = await prisma.patient.findMany({
      where: { user_email }
    });
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: error.message });
  }
}
