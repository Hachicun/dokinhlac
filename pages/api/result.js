//pages/api/result.js
import { authMiddleware } from '../../middleware/auth'; // Thêm dòng này để import middleware
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  await authMiddleware(req, res, async () => { // Thêm dòng này để sử dụng middleware
    const { dokinhlac_id } = req.query;
    const { email } = req.user; // Lấy email từ middleware

    if (!dokinhlac_id) {
      return res.status(400).json({ error: 'dokinhlac_id is required' });
    }

    try {
      const dokinhlac = await prisma.dokinhlac.findUnique({
        where: { dokinhlac_id: parseInt(dokinhlac_id) },
        include: { patient: true } // Bao gồm thông tin bệnh nhân liên quan
      });

      if (!dokinhlac) {
        return res.status(404).json({ error: 'Check data not found' });
      }

      // Kiểm tra user_email của bệnh nhân
      if (dokinhlac.patient.user_email !== email) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const patient = dokinhlac.patient;

      res.status(200).json({ dokinhlac, patient });
    } catch (error) {
      console.error('Error fetching result data:', error);
      res.status(500).json({ error: error.message });
    } finally {
      await prisma.$disconnect(); // Đảm bảo đóng kết nối
    }
  });
}
