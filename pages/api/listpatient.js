import { authMiddleware } from '../../middleware/auth'; // Import middleware
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  await authMiddleware(req, res, async () => { // Sử dụng middleware để xác thực
    if (req.method === 'GET') {
      const { email } = req.user; // Lấy email từ middleware

      try {
        const patients = await prisma.patient.findMany({
          where: {
            user_email: email, // Sử dụng email để lọc bệnh nhân
          },
        });
        res.status(200).json(patients);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
