//pages/newpatient.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext'; // Make sure the authentication context is properly set up

const NewPatient = () => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_history: ''
  });
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullData = { ...formData, user_email: currentUser.email };

    try {
      const response = await fetch('/api/addpatient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      });

      if (!response.ok) {
        throw new Error('Something went wrong with adding the patient');
      }

      // Redirect to the patient list page after successful creation
      router.push('/patient');
    } catch (error) {
      console.error('Failed to add patient:', error);
      alert('Failed to add patient: ' + error.message); // Optionally, display the error message to the user
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

      <button type="submit">Create Patient</button>
    </form>
  );
};

export default NewPatient;
