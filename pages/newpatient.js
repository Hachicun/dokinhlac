import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useAuthToken } from '../hooks/useAuthToken';

const NewPatient = () => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_year: '',
    patient_sex: '',
    patient_history: ''
  });
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const token = useAuthToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullData = { ...formData, user_email: currentUser.email };

    if (!token) {
      alert('Failed to authenticate. Please try again.');
      return;
    }

    try {
      const response = await fetch('/api/addpatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with adding the patient');
      }

      router.push('/patient');
    } catch (error) {
      console.error('Failed to add patient:', error);
      alert('Failed to add patient: ' + error.message);
    }
  };

  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Add a new patient</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="patient_name" className="block mb-2 text-sm font-medium text-gray-900">Patient Name</label>
              <input
                type="text"
                id="patient_name"
                name="patient_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Type patient name"
                value={formData.patient_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="patient_phone" className="block mb-2 text-sm font-medium text-gray-900">Patient Phone</label>
              <input
                type="text"
                id="patient_phone"
                name="patient_phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Patient phone"
                value={formData.patient_phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="patient_year" className="block mb-2 text-sm font-medium text-gray-900">Patient Year</label>
              <input
                type="number"
                id="patient_year"
                name="patient_year"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Patient year"
                value={formData.patient_year}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="patient_sex" className="block mb-2 text-sm font-medium text-gray-900">Patient Sex</label>
              <select
                id="patient_sex"
                name="patient_sex"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.patient_sex}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="patient_history" className="block mb-2 text-sm font-medium text-gray-900">Patient History</label>
              <textarea
                id="patient_history"
                name="patient_history"
                rows="4"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Patient history"
                value={formData.patient_history}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-300 hover:bg-blue-800"
          >
            Create Patient
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewPatient;
