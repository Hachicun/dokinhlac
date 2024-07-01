import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthToken } from '../hooks/useAuthToken'; // Thêm dòng này để import custom hook

const NewCheck = () => {
  const [patients, setPatients] = useState([]);
  const router = useRouter();
  const { patient_id } = router.query; // Lấy patient_id từ URL
  const token = useAuthToken(); // Thêm dòng này để lấy token

  const [formData, setFormData] = useState({
    symptom: '',
    patient_id: patient_id || '', // Thiết lập giá trị mặc định cho patient_id
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
            Authorization: `Bearer ${token}`, // Thêm header Authorization
          },
        });
        const data = await res.json();
        console.log('Fetched patients:', data); // Log the fetched data for debugging
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

    if (token) { // Thêm điều kiện kiểm tra token
      fetchPatients();
    }
  }, [token]); // Thêm token vào dependency array

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert numerical fields from string to number
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
        transformedData[field] = null; // Set empty fields to null
      }
    });

    try {
      const res = await fetch('/api/addcheck', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Thêm header Authorization
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="patient_id">Patient:</label>
      <select
        id="patient_id"
        name="patient_id"
        value={formData.patient_id}
        onChange={handleChange}
        required
        disabled={!!patient_id} // Disable the select input if patient_id is provided in the URL
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

      <label htmlFor="symptom">Symptom:</label>
      <textarea
        id="symptom"
        name="symptom"
        value={formData.symptom}
        onChange={handleChange}
      />

      {/* Add other input fields for check data here */}
      {Object.keys(formData).filter(key => key !== 'symptom' && key !== 'patient_id').map(key => (
        <div key={key}>
          <label htmlFor={key}>{key.replace(/_/g, ' ')}:</label>
          <input
            type="number"
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
          />
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};

export default NewCheck;
