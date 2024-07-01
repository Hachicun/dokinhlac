//pages/api/updatepatient.js
import prisma from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth'; // Thêm dòng này để import middleware

export default async function handler(req, res) {
    await authMiddleware(req, res, async () => { // Thêm dòng này để sử dụng middleware
      if (req.method === 'PUT') {
        const { patient_id, patient_name, patient_phone, patient_history } = req.body;
        const { email } = req.user; // Lấy email từ middleware
  
        try {
          const updatedPatient = await prisma.patient.update({
            where: { 
              patient_id: parseInt(patient_id, 10),
              user_email: email, // Thêm điều kiện email
            },
            data: {
              patient_name,
              patient_phone,
              patient_history,
              user_email: email // Đảm bảo user_email không bị thay đổi
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
    });
  }
  
