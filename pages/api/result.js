import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const { dokinhlac_id } = req.query;

  if (!dokinhlac_id) {
    return res.status(400).json({ error: 'dokinhlac_id is required' });
  }

  try {
    const dokinhlac = await prisma.dokinhlac.findUnique({
      where: { dokinhlac_id: parseInt(dokinhlac_id) },
    });

    if (!dokinhlac) {
      return res.status(404).json({ error: 'Check data not found' });
    }

    const patient = await prisma.patient.findUnique({
      where: { patient_id: dokinhlac.patient_id },
    });

    res.status(200).json({ dokinhlac, patient });
  } catch (error) {
    console.error('Error fetching result data:', error);
    res.status(500).json({ error: error.message });
  }
}
