import { authMiddleware } from '../../middleware/auth'; // Thêm dòng này để import middleware
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  await authMiddleware(req, res, async () => { // Thêm dòng này để sử dụng middleware
    if (req.method === 'DELETE') {
      const { id } = req.query;
      const { email } = req.user; // Lấy email từ middleware

      if (!id) {
        return res.status(400).json({ error: 'id is required' });
      }

      try {
        // Tìm dokinhlac để lấy patient_id
        const dokinhlac = await prisma.dokinhlac.findUnique({
          where: { dokinhlac_id: parseInt(id, 10) },
          include: { patient: true } // Bao gồm thông tin bệnh nhân liên quan
        });

        if (!dokinhlac) {
          return res.status(404).json({ error: 'dokinhlac not found' });
        }

        // Kiểm tra user_email của bệnh nhân
        if (dokinhlac.patient.user_email !== email) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        // Xóa dokinhlac
        const deletedDokinhlac = await prisma.dokinhlac.delete({
          where: { dokinhlac_id: parseInt(id, 10) },
        });
        res.status(200).json(deletedDokinhlac);
      } catch (error) {
        console.error('Error deleting dokinhlac:', error);
        res.status(500).json({ error: 'Failed to delete dokinhlac' });
      } finally {
        await prisma.$disconnect(); // Đảm bảo đóng kết nối
      }
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
