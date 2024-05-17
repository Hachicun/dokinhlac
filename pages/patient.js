import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Ensure you have this context setup for auth
import { useRouter } from 'next/router';

const Patient = () => {
  const { currentUser } = useAuth(); // This assumes you have a hook to access the current user
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
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

  const handleAddPatient = () => {
    router.push('/newpatient');
  };

  const handleSelectPatient = (patientId) => {
    setSelectedPatient(patientId);
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) {
      alert('Please select a patient to delete.');
      return;
    }

    try {
      const res = await fetch(`/api/deletepatient?patient_id=${encodeURIComponent(selectedPatient)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete patient');
      setPatients(patients.filter((patient) => patient.patient_id !== selectedPatient));
      setSelectedPatient(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Patient List</h1>
      <button onClick={handleAddPatient}>Add Patient</button>
      <button onClick={handleDeletePatient} disabled={!selectedPatient}>Delete Patient</button>
      {patients.length > 0 ? (
        <ul>
          {patients.map((patient) => (
            <li key={patient.patient_id}>
              <span>{patient.patient_name} - {patient.patient_phone}</span>
              <button onClick={() => handleSelectPatient(patient.patient_id)}>
                {selectedPatient === patient.patient_id ? 'Selected' : 'Select Patient'}
              </button>
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
