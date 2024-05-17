import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { patient_id, patient_name, patient_phone, patient_history, user_email } = req.body;

    try {
      const updatedPatient = await prisma.patient.update({
        where: { patient_id: parseInt(patient_id, 10) },
        data: {
          patient_name,
          patient_phone,
          patient_history,
          user_email
        }
      });
      res.status(200).json(updatedPatient);
    } catch (error) {
      console.error('Error updating patient:', error);
      res.status(500).json({ error: 'Failed to update patient' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
