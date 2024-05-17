// pages/patientdetail.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Compare = dynamic(() => import('../components/Compare'), { ssr: false });

const PatientDetail = () => {
  const router = useRouter();
  const { patient_id } = router.query;
  const [patient, setPatient] = useState(null);
  const [dokinhlac, setDokinhlac] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [rawData, setRawData] = useState([]);

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

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/deletedokinhlac?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
          })
        )
      );
      setDokinhlac(dokinhlac.filter((item) => !selectedIds.includes(item.dokinhlac_id)));
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete dokinhlac:', err);
    }
  };

  const handleCompare = async () => {
    try {
      const responses = await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/result?dokinhlac_id=${encodeURIComponent(id)}`)
        )
      );
      const data = await Promise.all(responses.map((res) => res.json()));
      const rawData = data.map((item) => item.dokinhlac);
      console.log('Raw Data:', rawData); // Log rawData
      setRawData(rawData);
    } catch (err) {
      console.error('Failed to fetch comparison data:', err);
    }
  };

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
                <li key={item.dokinhlac_id}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.dokinhlac_id)}
                    onChange={() => handleSelect(item.dokinhlac_id)}
                  />
                  {item.dokinhlac_id}
                  <button onClick={() => router.push(`/result?dokinhlac_id=${item.dokinhlac_id}`)}>
                    View
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>No dokinhlac found</div>
          )}
          <button onClick={handleDelete} disabled={selectedIds.length === 0}>
            Delete
          </button>
          <button onClick={handleCompare} disabled={selectedIds.length < 2}>
            Compare
          </button>
          {rawData.length > 0 && <Compare rawData={rawData} />}
        </>
      ) : (
        <div>Patient not found</div>
      )}
    </div>
  );
};

export default PatientDetail;
