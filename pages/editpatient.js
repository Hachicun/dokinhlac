import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext'; 
import { useAuthToken } from '../hooks/useAuthToken'; 

const EditPatient = () => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_history: ''
  });
  const { currentUser } = useAuth(); 
  const router = useRouter();
  const { patient_id } = router.query; 
  const token = useAuthToken(); 

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await fetch(`/api/patientdetail?patient_id=${encodeURIComponent(patient_id)}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
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

    if (patient_id && token) { 
      fetchPatientDetails();
    }
  }, [patient_id, token]); 

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
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with updating the patient');
      }

      router.push(`/patientdetail?patient_id=${patient_id}`);
    } catch (error) {
      console.error('Failed to update patient:', error);
      alert('Failed to update patient: ' + error.message); 
    }
  };

  const handleCancel = () => {
    router.push(`/patientdetail?patient_id=${patient_id}`);
  };

  return (
    <section className="bg-white">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Update Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label htmlFor="patient_name" className="block mb-2 text-sm font-medium text-gray-900">Patient Name</label>
              <input
                type="text"
                id="patient_name"
                name="patient_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                value={formData.patient_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="patient_phone" className="block mb-2 text-sm font-medium text-gray-900">Patient Phone</label>
              <input
                type="text"
                id="patient_phone"
                name="patient_phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                value={formData.patient_phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="patient_history" className="block mb-2 text-sm font-medium text-gray-900">Patient History</label>
              <textarea
                id="patient_history"
                name="patient_history"
                rows="8"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                value={formData.patient_history}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Update Patient
            </button>
            <button 
              type="button" 
              className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={handleCancel}
            >
              <svg className="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPatient;
