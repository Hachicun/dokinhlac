//pages/patient.js
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Ensure you have this context setup for auth
import { useRouter } from 'next/router';
import { useAuthToken } from '../hooks/useAuthToken'; // Thêm dòng này để import custom hook


const Patient = () => {
  const { currentUser } = useAuth(); // This assumes you have a hook to access the current user
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const token = useAuthToken(); // Thêm dòng này để lấy token

  useEffect(() => {
    const fetchPatients = async () => {
      if (token) { // Thay đổi currentUser && currentUser.email thành token
        try {
          const res = await fetch('/api/listpatient', {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm header Authorization
            },
          });
          if (!res.ok) throw new Error('Failed to fetch patients');
          const data = await res.json();
          setPatients(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchPatients();
  }, [token]);

  const handleAddPatient = () => {
    router.push('/newpatient');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Patient List</h1>
      <button onClick={handleAddPatient}>Add Patient</button>
      {patients.length > 0 ? (
        <ul>
          {patients.map((patient) => (
            <li key={patient.patient_id}>
              <span>{patient.patient_name} - {patient.patient_phone}</span>
              <button onClick={() => router.push(`/patientdetail?patient_id=${patient.patient_id}`)}>
                View
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No patients found</div>
      )}
    </div>
  );
};

export default Patient;
