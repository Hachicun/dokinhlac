import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAuthToken } from '../hooks/useAuthToken'; // Thêm dòng này để import custom hook

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
  const token = useAuthToken(); // Thêm dòng này để lấy token

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (patient_id && token) { // Thêm điều kiện kiểm tra token
        try {
          const res = await fetch(`/api/patientdetail?patient_id=${encodeURIComponent(patient_id)}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm header Authorization
            },
          });
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
  }, [patient_id, token]); // Thêm token vào dependency array

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEditPatient = () => {
    router.push(`/editpatient?patient_id=${patient_id}`);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/deletedokinhlac?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`, // Thêm header Authorization
            },
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
          fetch(`/api/result?dokinhlac_id=${encodeURIComponent(id)}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm header Authorization
            },
          })
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

  const handleAddCheck = () => {
    router.push(`/newcheck?patient_id=${patient_id}`);
  };

  const handleDeletePatient = async () => {
    try {
      const res = await fetch(`/api/deletepatient?patient_id=${encodeURIComponent(patient_id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Thêm header Authorization
        },
      });
      if (!res.ok) throw new Error('Failed to delete patient');
      router.push('/patient'); // Điều hướng trở lại trang danh sách bệnh nhân sau khi xóa
    } catch (err) {
      console.error('Failed to delete patient:', err);
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
          <button onClick={handleAddCheck}>Add Check</button>
          <button onClick={handleEditPatient}>Edit Patient</button>
          <button onClick={handleDeletePatient}>Delete Patient</button>
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
