import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const { patient_id } = req.query;

  if (!patient_id) {
    return res.status(400).json({ error: 'Patient ID is required' });
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_id: parseInt(patient_id) },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const dokinhlac = await prisma.dokinhlac.findMany({
      where: { patient_id: parseInt(patient_id) },
    });

    res.status(200).json({ patient, dokinhlac });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ error: error.message });
  }
}
