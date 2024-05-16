import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    console.log('Received data:', data); // Log received data for debugging

    try {
      const newCheck = await prisma.dokinhlac.create({
        data: {
          ...data,
          patient_id: parseInt(data.patient_id, 10)
        }
      });
      res.status(201).json(newCheck);
    } catch (error) {
      console.error('Error adding check data:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
