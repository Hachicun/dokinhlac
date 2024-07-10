import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useAuthToken } from '../hooks/useAuthToken';

const Patient = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const token = useAuthToken();

  useEffect(() => {
    const fetchPatients = async () => {
      if (token) {
        try {
          const res = await fetch('/api/listpatient', {
            headers: {
              Authorization: `Bearer ${token}`,
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

  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Vui lòng đợi...</div>;
  if (error) return <div>Xảy ra lỗi: {error}</div>;

  return (
    <section className="flex flex-col min-h-screen bg-gray-50 p-3 sm:p-5">
      <div className="flex-grow mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white shadow-md sm:rounded-lg overflow-hidden flex flex-col h-full min-h-[calc(100vh-10rem)]">
          <div className="p-4 flex-grow flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Danh sách bệnh nhân</h1>
            <button
              type="button"
              className="mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
              onClick={handleAddPatient}
            >
              Thêm bệnh nhân
            </button>
            <form className="flex items-center mb-4">
              <label htmlFor="search" className="sr-only">Tìm kiếm</label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-gray-500">
                <thead className="text-gray-700  bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3">Tên bệnh nhân</th>
                    <th scope="col" className="px-4 py-3">SĐT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr
                        key={patient.patient_id}
                        className="border-b cursor-pointer"
                        onClick={() => router.push(`/patientdetail?patient_id=${patient.patient_id}`)}
                      >
                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{patient.patient_name}</th>
                        <td className="px-4 py-3">{patient.patient_phone}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-center">Chưa có bệnh nhân nào!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Patient;
