//pages/api/addpatient.js
import prisma from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth'; // Thêm dòng này để import middleware


export default async function handler(req, res) {
  await authMiddleware(req, res, async () => { // Thêm dòng này để sử dụng middleware
    if (req.method === 'POST') {
      const { patient_name, patient_phone, patient_history } = req.body;
      const { email } = req.user; // Lấy email từ middleware

      console.log('Received data:', req.body);  // Log incoming data for debugging

      // Additional logging before the request
      console.log('Preparing to create a new patient with:', {
        patient_name, patient_phone, patient_history, user_email: email
      });

      try {
        const newPatient = await prisma.patient.create({
          data: {
            patient_name,
            patient_phone,
            patient_history,
            user_email: email // Sử dụng email từ middleware
          }
        });
        console.log('New patient created:', newPatient);  // Log the result of the creation
        res.status(201).json(newPatient);
      } catch (error) {
        console.error('Error creating new patient:', error);
        // Log more detailed error information
        if (error instanceof prisma.Prisma.PrismaClientKnownRequestError) {
          // Check if it's a known request error (e.g., a unique constraint failure)
          console.error('Error details:', {
            code: error.code,
            meta: error.meta,
          });
        }
        res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}