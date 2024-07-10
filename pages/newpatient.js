import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useAuthToken } from '../hooks/useAuthToken';
import PatientHistorySelector from '../components/PatientHistorySelector';

const NewPatient = () => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_year: '',
    patient_sex: '',
    patient_history: ''
  });
  const [errors, setErrors] = useState({});
  const { currentUser } = useAuth();
  const router = useRouter();
  const token = useAuthToken();

  const refs = {
    patient_name: useRef(null),
    patient_phone: useRef(null),
    patient_year: useRef(null),
    patient_sex: useRef(null),
    patient_history: useRef(null)
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear errors on change
  };

  const handleHistoryChange = (history) => {
    setFormData({ ...formData, patient_history: history });
    setErrors({ ...errors, patient_history: '' }); // Clear errors on change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.patient_name) newErrors.patient_name = 'Patient name is required';
    if (!formData.patient_phone) newErrors.patient_phone = 'Patient phone is required';
    if (!formData.patient_year) newErrors.patient_year = 'Patient year is required';
    if (!formData.patient_sex) newErrors.patient_sex = 'Patient sex is required';
    if (!formData.patient_history) newErrors.patient_history = 'Patient history is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      refs[firstErrorField].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

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
        <h2 className="mb-4 text-xl font-bold text-gray-900">Thêm bệnh nhân mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="patient_name" className="block mb-2 text-sm font-medium text-gray-900">Tên bệnh nhân</label>
              <input
                ref={refs.patient_name}
                type="text"
                id="patient_name"
                name="patient_name"
                className={`bg-gray-50 border ${errors.patient_name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Điền tên bệnh nhân"
                value={formData.patient_name}
                onChange={handleChange}
                required
              />
              {errors.patient_name && <p className="text-red-500 text-sm mt-1">{errors.patient_name}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="patient_phone" className="block mb-2 text-sm font-medium text-gray-900">Số điện thoại</label>
              <input
                ref={refs.patient_phone}
                type="tel"
                id="patient_phone"
                name="patient_phone"
                inputMode="numeric"
                className={`bg-gray-50 border ${errors.patient_phone ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                value={formData.patient_phone}
                onChange={handleChange}
                required
              />
              {errors.patient_phone && <p className="text-red-500 text-sm mt-1">{errors.patient_phone}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="patient_year" className="block mb-2 text-sm font-medium text-gray-900">Năm sinh</label>
              <input
                ref={refs.patient_year}
                type="number"
                id="patient_year"
                name="patient_year"
                inputMode="numeric"
                className={`bg-gray-50 border ${errors.patient_year ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                value={formData.patient_year}
                onChange={handleChange}
                required
              />
              {errors.patient_year && <p className="text-red-500 text-sm mt-1">{errors.patient_year}</p>}
            </div>
            <div>
              <label htmlFor="patient_sex" className="block mb-2 text-sm font-medium text-gray-900">Giới tính</label>
              <select
                ref={refs.patient_sex}
                id="patient_sex"
                name="patient_sex"
                className={`bg-gray-50 border ${errors.patient_sex ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                value={formData.patient_sex}
                onChange={handleChange}
                required
              >
                <option value="Selection">Chọn giới tính</option>               
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              {errors.patient_sex && <p className="text-red-500 text-sm mt-1">{errors.patient_sex}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="patient_history" className="block mb-2 text-sm font-medium text-gray-900">Tiền sử</label>
              <PatientHistorySelector onHistoryChange={handleHistoryChange} />
              {errors.patient_history && <p className="text-red-500 text-sm mt-1">{errors.patient_history}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-300 hover:bg-blue-800"
          >
            Thêm bệnh nhân
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewPatient;
