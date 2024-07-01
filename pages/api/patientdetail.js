import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth'; // Thêm dòng này để import middleware

const prisma = new PrismaClient();

export default async function handler(req, res) {
  await authMiddleware(req, res, async () => { // Thêm dòng này để sử dụng middleware
    const { patient_id } = req.query;
    const { email } = req.user; // Lấy email từ middleware

    if (!patient_id) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    try {
      // Tìm bệnh nhân dựa trên patient_id và user_email
      const patient = await prisma.patient.findFirst({
        where: { 
          patient_id: parseInt(patient_id),
          user_email: email, // Thêm điều kiện email
        },
      });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Tìm các bản ghi dokinhlac dựa trên patient_id
      const dokinhlac = await prisma.dokinhlac.findMany({
        where: { 
          patient_id: parseInt(patient_id),
        },
      });

      res.status(200).json({ patient, dokinhlac });
    } catch (error) {
      console.error('Error fetching patient details:', error);
      res.status(500).json({ error: error.message });
    } finally {
      await prisma.$disconnect(); // Đảm bảo đóng kết nối
    }
  });
}
