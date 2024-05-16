import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const NewCheck = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    symptom: '',
    patient_id: '',
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
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/allpatient');
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

    fetchPatients();
  }, []);

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
        headers: { 'Content-Type': 'application/json' },
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
