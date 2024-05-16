import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Ensure you have this context setup for auth
import { useRouter } from 'next/router';

const Patient = () => {
  const { currentUser } = useAuth(); // This assumes you have a hook to access the current user
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      if (currentUser && currentUser.email) {
        try {
          const res = await fetch(`/api/listpatient?user_email=${encodeURIComponent(currentUser.email)}`);
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
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Patient List</h1>
      {patients.length > 0 ? (
        <ul>
          {patients.map((patient) => (
            <li key={patient.patient_id} onClick={() => router.push(`/patientdetail?patient_id=${patient.patient_id}`)}>
              {patient.patient_name} - {patient.patient_phone}
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
