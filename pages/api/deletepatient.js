//pages/api/deletepatient
import prisma from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth'; // Thêm dòng này để import middleware

export default async function handler(req, res) {
  await authMiddleware(req, res, async () => { // Thêm dòng này để sử dụng middleware
    if (req.method === 'DELETE') {
      const { patient_id } = req.query;
      const { email } = req.user; // Lấy email từ middleware

      if (!patient_id) {
        return res.status(400).json({ error: 'patient_id is required' });
      }

      try {
        // Xóa các bản ghi liên quan trong bảng dokinhlac
        await prisma.dokinhlac.deleteMany({
          where: { 
            patient_id: parseInt(patient_id, 10)
          },
        });

        // Xóa bệnh nhân
        const deletedPatient = await prisma.patient.delete({
          where: { 
            patient_id: parseInt(patient_id, 10),
            user_email: email // Thêm điều kiện email
          },
        });
        res.status(200).json(deletedPatient);
      } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({
          error: 'Failed to delete patient',
          details: error.message,
        });
      }
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
