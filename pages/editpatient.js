import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext'; // vẫn như code ban đầu
import { useAuthToken } from '../hooks/useAuthToken'; // Thêm dòng này để import custom hook

const EditPatient = () => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_history: ''
  });
  const { currentUser } = useAuth(); // vẫn như code ban đầu
  const router = useRouter();
  const { patient_id } = router.query; // vẫn như code ban đầu
  const token = useAuthToken(); // Thêm dòng này để lấy token

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await fetch(`/api/patientdetail?patient_id=${encodeURIComponent(patient_id)}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm header Authorization
          },
        });
        if (!res.ok) throw new Error('Failed to fetch patient details');
        const data = await res.json();
        setFormData({
          patient_name: data.patient.patient_name,
          patient_phone: data.patient.patient_phone,
          patient_history: data.patient.patient_history
        });
      } catch (err) {
        console.error('Failed to fetch patient details:', err);
      }
    };

    if (patient_id && token) { // Thêm điều kiện kiểm tra token
      fetchPatientDetails();
    }
  }, [patient_id, token]); // Thêm token vào dependency array

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullData = { ...formData, user_email: currentUser.email, patient_id: parseInt(patient_id, 10) };

    if (!token) {
      alert('Failed to authenticate. Please try again.');
      return;
    }

    try {
      const response = await fetch('/api/updatepatient', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Thêm header Authorization
        },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with updating the patient');
      }

      // Redirect to the patient detail page after successful update
      router.push(`/patientdetail?patient_id=${patient_id}`);
    } catch (error) {
      console.error('Failed to update patient:', error);
      alert('Failed to update patient: ' + error.message); // Optionally, display the error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="patient_name">Patient Name:</label>
      <input
        type="text"
        id="patient_name"
        name="patient_name"
        value={formData.patient_name}
        onChange={handleChange}
        required
      />

      <label htmlFor="patient_phone">Patient Phone:</label>
      <input
        type="text"
        id="patient_phone"
        name="patient_phone"
        value={formData.patient_phone}
        onChange={handleChange}
        required
      />

      <label htmlFor="patient_history">Patient History:</label>
      <textarea
        id="patient_history"
        name="patient_history"
        value={formData.patient_history}
        onChange={handleChange}
        required
      />

      <button type="submit">Update Patient</button>
    </form>
  );
};

export default EditPatient;
