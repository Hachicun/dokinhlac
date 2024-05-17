import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    try {
      const deletedDokinhlac = await prisma.dokinhlac.delete({
        where: { dokinhlac_id: parseInt(id, 10) },
      });
      res.status(200).json(deletedDokinhlac);
    } catch (error) {
      console.error('Error deleting dokinhlac:', error);
      res.status(500).json({ error: 'Failed to delete dokinhlac' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
