import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { useAuthToken } from '../hooks/useAuthToken';
import { FaUserEdit, FaTrashAlt, FaPlus, FaEye, FaTrash, FaEquals } from 'react-icons/fa';
import Spinner from '../components/Spinner'; // Import Spinner

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
  const [comparing, setComparing] = useState(false); // Thêm trạng thái so sánh
  const token = useAuthToken();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (patient_id && token) {
        try {
          const res = await fetch(`/api/patientdetail?patient_id=${encodeURIComponent(patient_id)}`, {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [patient_id, token]);

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
              Authorization: `Bearer ${token}`,
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
    setComparing(true); // Bắt đầu trạng thái so sánh
    try {
      const responses = await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/result?dokinhlac_id=${encodeURIComponent(id)}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      const data = await Promise.all(responses.map((res) => res.json()));
      const rawData = data.map((item) => item.dokinhlac);
      setRawData(rawData);
    } catch (err) {
      console.error('Failed to fetch comparison data:', err);
    } finally {
      setComparing(false); // Kết thúc trạng thái so sánh
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
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete patient');
      router.push('/patient');
    } catch (err) {
      console.error('Failed to delete patient:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="bg-white min-h-screen pb-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Thông tin bệnh nhân</h1>
        {patient ? (
          <>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{patient.patient_name}</h2>
            <div className="mb-6">
              <p className="text-lg text-gray-600">Số điện thoại: {patient.patient_phone}</p>
              <p className="text-lg text-gray-600">Năm sinh: {patient.patient_year}</p>
              <p className="text-lg text-gray-600">Giới tính: {patient.patient_sex}</p>
              <p className="text-lg text-gray-600">Bệnh sử: {patient.patient_history}</p>
            </div>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleAddCheck}
                className="flex flex-col items-center px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800"
              >
                <FaPlus className="mb-1" />
                <span className="text-xs">Đo mới</span>
              </button>
              <button
                onClick={handleEditPatient}
                className="flex flex-col items-center px-4 py-2 text-black bg-yellow-500 rounded-lg hover:bg-yellow-600"
              >
                <FaUserEdit className="mb-1" />
                <span className="text-xs">Chỉnh sửa</span>
              </button>
              <button
                onClick={handleDeletePatient}
                className="flex flex-col items-center px-4 py-2 text-white bg-red-700 rounded-lg hover:bg-red-800"
              >
                <FaTrashAlt className="mb-1" />
                <span className="text-xs">Xóa</span>
              </button>
            </div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">Bản ghi đo kinh lạc</h2>
            {dokinhlac.length > 0 ? (
              <ul className="mb-6">
                {dokinhlac.map((item) => (
                  <li key={item.dokinhlac_id} className="mb-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.dokinhlac_id)}
                        onChange={() => handleSelect(item.dokinhlac_id)}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="text-lg">{format(new Date(item.created_at), 'HH:mm dd/MM/yyyy')}</span>
                      <button
                        onClick={() => router.push(`/result?dokinhlac_id=${item.dokinhlac_id}`)}
                        className="flex items-center px-4 py-2 text-sm text-white bg-green-700 rounded-lg hover:bg-green-800"
                      >
                        <FaEye className="mr-2" />
                        Chi tiết
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-lg text-gray-600">Chưa có lần đo nào</div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={handleDelete}
                disabled={selectedIds.length === 0}
                className={`flex items-center px-4 py-2 text-white rounded-lg ${selectedIds.length === 0 ? 'bg-gray-400' : 'bg-red-700 hover:bg-red-800'}`}
              >
                <FaTrash className="mr-2" />
                Xóa
              </button>
              <button
                onClick={handleCompare}
                disabled={selectedIds.length < 2 || comparing}
                className={`flex items-center px-4 py-2 text-white rounded-lg ${selectedIds.length < 2 || comparing ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'}`}
              >
                <FaEquals className="mr-2" />
                {comparing ? 'Đang so sánh...' : 'So sánh'}
              </button>
            </div>
            {comparing && <Spinner />} {/* Hiển thị spinner khi so sánh */}
            {rawData.length > 0 && <Compare rawData={rawData} />}
          </>
        ) : (
          <div className="text-lg text-gray-600">Không tìm thấy bệnh nhân</div>
        )}
      </div>
    </section>
  );
};

export default PatientDetail;
