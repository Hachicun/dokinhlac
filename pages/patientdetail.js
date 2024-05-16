import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PatientDetail = () => {
  const router = useRouter();
  const { patient_id } = router.query;
  const [patient, setPatient] = useState(null);
  const [dokinhlac, setDokinhlac] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (patient_id) {
        try {
          const res = await fetch(`/api/patientdetail?patient_id=${encodeURIComponent(patient_id)}`);
          if (!res.ok) throw new Error('Failed to fetch patient details');
          const data = await res.json();
          setPatient(data.patient);
          setDokinhlac(data.dokinhlac);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientDetails();
  }, [patient_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {patient ? (
        <>
          <h1>{patient.patient_name}</h1>
          <p>Phone: {patient.patient_phone}</p>
          <p>History: {patient.patient_history}</p>
          <h2>Dokinhlac IDs</h2>
          {dokinhlac.length > 0 ? (
            <ul>
              {dokinhlac.map((item) => (
                <li key={item.dokinhlac_id} onClick={() => router.push(`/result?dokinhlac_id=${item.dokinhlac_id}`)}>
                  {item.dokinhlac_id}
                </li>
              ))}
            </ul>
          ) : (
            <div>No dokinhlac found</div>
          )}
        </>
      ) : (
        <div>Patient not found</div>
      )}
    </div>
  );
};

export default PatientDetail;
