import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthToken } from '../hooks/useAuthToken';

const NewCheck = () => {
  const [patients, setPatients] = useState([]);
  const router = useRouter();
  const { patient_id } = router.query;
  const token = useAuthToken();

  const [formData, setFormData] = useState({
    symptom: '',
    patient_id: patient_id || '',
    tieutruong_trai: '',
    tam_trai: '',
    tamtieu_trai: '',
    tambao_trai: '',
    daitruong_trai: '',
    phe_trai: '',
    tieutruong_phai: '',
    tam_phai: '',
    tamtieu_phai: '',
    tambao_phai: '',
    daitruong_phai: '',
    phe_phai: '',
    bangquang_trai: '',
    than_trai: '',
    dom_trai: '',
    vi_trai: '',
    can_trai: '',
    ty_trai: '',
    bangquang_phai: '',
    than_phai: '',
    dom_phai: '',
    vi_phai: '',
    can_phai: '',
    ty_phai: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/listpatient', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          setPatients([]);
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setPatients([]);
      }
    };

    if (token) {
      fetchPatients();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericFields = [
      'tieutruong_trai', 'tam_trai', 'tamtieu_trai', 'tambao_trai', 'daitruong_trai', 'phe_trai',
      'tieutruong_phai', 'tam_phai', 'tamtieu_phai', 'tambao_phai', 'daitruong_phai', 'phe_phai',
      'bangquang_trai', 'than_trai', 'dom_trai', 'vi_trai', 'can_trai', 'ty_trai',
      'bangquang_phai', 'than_phai', 'dom_phai', 'vi_phai', 'can_phai', 'ty_phai'
    ];

    const transformedData = { ...formData };
    numericFields.forEach(field => {
      if (transformedData[field] !== '') {
        transformedData[field] = parseInt(transformedData[field], 10);
      } else {
        transformedData[field] = null;
      }
    });

    try {
      const res = await fetch('/api/addcheck', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformedData)
      });

      if (!res.ok) throw new Error('Failed to add check data');

      const data = await res.json();
      router.push(`/result?dokinhlac_id=${data.dokinhlac_id}`);
    } catch (error) {
      console.error('Error adding check data:', error);
    }
  };

  return (
    <section className="bg-white min-h-screen pt-16 pb-16"> {/* Thêm pt-16 và pb-16 */}
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Add a new check</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="patient_id" className="block mb-2 text-sm font-medium text-gray-900">Patient</label>
              <select
                id="patient_id"
                name="patient_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.patient_id}
                onChange={handleChange}
                required
                disabled={!!patient_id}
              >
                <option value="">Select a patient</option>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {patient.patient_name}
                    </option>
                  ))
                ) : (
                  <option value="">No patients available</option>
                )}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="symptom" className="block mb-2 text-sm font-medium text-gray-900">Symptom</label>
              <textarea
                id="symptom"
                name="symptom"
                rows="4"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Describe the symptom"
                value={formData.symptom}
                onChange={handleChange}
                required
              />
            </div>
            {Object.keys(formData).filter(key => key !== 'symptom' && key !== 'patient_id').map(key => (
              <div className="w-full" key={key}>
                <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900">{key.replace(/_/g, ' ')}</label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData[key]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-300 hover:bg-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewCheck;
