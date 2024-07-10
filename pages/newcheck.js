import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuthToken } from '../hooks/useAuthToken';
import PatientHistorySelector from '../components/PatientHistorySelector';

const fieldLabels = {
  tieutruong_trai: 'Tiểu trường trái',
  tam_trai: 'Tâm trái',
  tamtieu_trai: 'Tam tiêu trái',
  tambao_trai: 'Tâm bào trái',
  daitruong_trai: 'Đại trường trái',
  phe_trai: 'Phế trái',
  bangquang_trai: 'Bàng quang trái',
  than_trai: 'Thận trái',
  dom_trai: 'Đởm trái',
  vi_trai: 'Vị trái',
  can_trai: 'Can trái',
  ty_trai: 'Tỳ trái',
  tieutruong_phai: 'Tiểu trường phải',
  tam_phai: 'Tâm phải',
  tamtieu_phai: 'Tam tiêu phải',
  tambao_phai: 'Tâm bào phải',
  daitruong_phai: 'Đại trường phải',
  phe_phai: 'Phế phải',
  bangquang_phai: 'Bàng quang phải',
  than_phai: 'Thận phải',
  dom_phai: 'Đởm phải',
  vi_phai: 'Vị phải',
  can_phai: 'Can phải',
  ty_phai: 'Tỳ phải',
};

const Spinner = () => (
  <div className="flex justify-center items-center mt-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

const NewCheck = () => {
  const [patients, setPatients] = useState([]);
  const router = useRouter();
  const { patient_id } = router.query;
  const token = useAuthToken();
  
  const refs = useRef({});
  
  const [formData, setFormData] = useState({
    symptom: '',
    patient_id: patient_id || '',
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

  const [loading, setLoading] = useState(false);

  const numericFields = [
    'tieutruong_trai', 'tam_trai', 'tamtieu_trai', 'tambao_trai', 'daitruong_trai', 'phe_trai',
    'tieutruong_phai', 'tam_phai', 'tamtieu_phai', 'tambao_phai', 'daitruong_phai', 'phe_phai',
    'bangquang_trai', 'than_trai', 'dom_trai', 'vi_trai', 'can_trai', 'ty_trai',
    'bangquang_phai', 'than_phai', 'dom_phai', 'vi_phai', 'can_phai', 'ty_phai'
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/listpatient', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
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

    if (token) {
      fetchPatients();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSymptomChange = (symptom) => {
    setFormData({ ...formData, symptom });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if all numeric fields are between 100 and 500
    for (const field of numericFields) {
      const value = parseFloat(formData[field]);
      if (isNaN(value) || value < 100 || value > 500) {
        alert(`Giá trị của ${fieldLabels[field]} phải nằm trong khoảng từ 100 đến 500`);
        refs.current[field].scrollIntoView({ behavior: 'smooth', block: 'center' });
        refs.current[field].focus();
        setLoading(false);
        return;
      }
    }

    const transformedData = { ...formData };
    numericFields.forEach(field => {
      if (transformedData[field] !== '') {
        transformedData[field] = parseFloat(transformedData[field]) / 10; // Chia giá trị cho 10 trước khi gửi
      } else {
        transformedData[field] = null;
      }
    });

    try {
      const res = await fetch('/api/addcheck', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformedData)
      });

      if (!res.ok) throw new Error('Failed to add check data');

      const data = await res.json();
      router.push(`/result?dokinhlac_id=${data.dokinhlac_id}`);
    } catch (error) {
      console.error('Error adding check data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white min-h-screen pb-16">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Đo kinh lạc mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bệnh nhân</h3>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="patient_id" className="block mb-2 text-sm font-medium text-gray-900">Bệnh nhân</label>
                <select
                  id="patient_id"
                  name="patient_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  disabled={!!patient_id}
                >
                  <option value="">Chọn bệnh nhân</option>
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <option key={patient.patient_id} value={patient.patient_id}>
                        {patient.patient_name}
                      </option>
                    ))
                  ) : (
                    <option value="">Chưa có bệnh nhân</option>
                  )}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="symptom" className="block mb-2 text-sm font-medium text-gray-900">Triệu chứng cần kiểm tra</label>
                <PatientHistorySelector onHistoryChange={handleSymptomChange} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nhập số liệu</h3>

            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Tay trái</h4>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {['tieutruong_trai', 'tam_trai', 'tamtieu_trai', 'tambao_trai', 'daitruong_trai', 'phe_trai'].map(key => (
                  <div className="w-full" key={key}>
                    <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900">{fieldLabels[key]}</label>
                    <input
                      type="number"
                      id={key}
                      name={key}
                      inputMode="numeric"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={formData[key]}
                      onChange={handleChange}
                      ref={el => refs.current[key] = el}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Tay phải</h4>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {['tieutruong_phai', 'tam_phai', 'tamtieu_phai', 'tambao_phai', 'daitruong_phai', 'phe_phai'].map(key => (
                  <div className="w-full" key={key}>
                    <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900">{fieldLabels[key]}</label>
                    <input
                      type="number"
                      id={key}
                      name={key}
                      inputMode="numeric"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={formData[key]}
                      onChange={handleChange}
                      ref={el => refs.current[key] = el}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Chân trái</h4>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {['bangquang_trai', 'than_trai', 'dom_trai', 'vi_trai', 'can_trai', 'ty_trai'].map(key => (
                  <div className="w-full" key={key}>
                    <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900">{fieldLabels[key]}</label>
                    <input
                      type="number"
                      id={key}
                      name={key}
                      inputMode="numeric"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={formData[key]}
                      onChange={handleChange}
                      ref={el => refs.current[key] = el}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Chân phải</h4>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {['bangquang_phai', 'than_phai', 'dom_phai', 'vi_phai', 'can_phai', 'ty_phai'].map(key => (
                  <div className="w-full" key={key}>
                    <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900">{fieldLabels[key]}</label>
                    <input
                      type="number"
                      id={key}
                      name={key}
                      inputMode="numeric"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={formData[key]}
                      onChange={handleChange}
                      ref={el => refs.current[key] = el}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`inline-flex items-center px-5 py-2.5 mt-4 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:ring-blue-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
            disabled={loading}
          >
            {loading && <Spinner />}
            {!loading && 'Kết quả'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewCheck;
