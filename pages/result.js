import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { calculateDataset } from '../utils/calculateDataset';
import dynamic from 'next/dynamic';
import { useAuthToken } from '../hooks/useAuthToken'; // Thêm dòng này để import custom hook
import PDFButtons from '../components/PDFButtons'; // Thêm dòng này để import PDFButtons

const ChartComponent = dynamic(() => import('../components/ChartComponent'), { ssr: false });
const BasicAnalytic = dynamic(() => import('../components/BasicAnalytic'), { ssr: false });
const HandToeAnalytic = dynamic(() => import('../components/HandToeAnalytic'), { ssr: false });
const ColdHeatAnalytic = dynamic(() => import('../components/ColdHeatAnalytic'), { ssr: false });

const Result = () => {
  const router = useRouter();
  const { dokinhlac_id } = router.query;
  const [checkData, setCheckData] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calDataset, setCalDataset] = useState(null);
  const token = useAuthToken(); // Thêm dòng này để lấy token

  useEffect(() => {
    const fetchResult = async () => {
      if (dokinhlac_id && token) { // Thêm điều kiện kiểm tra token
        try {
          const res = await fetch(`/api/result?dokinhlac_id=${encodeURIComponent(dokinhlac_id)}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm header Authorization
            },
          });
          if (!res.ok) throw new Error('Failed to fetch result data');
          const data = await res.json();
          setCheckData(data.dokinhlac);
          setPatient(data.patient);

          const originDataset = {
            tieutruong_trai: data.dokinhlac.tieutruong_trai,
            tam_trai: data.dokinhlac.tam_trai,
            tamtieu_trai: data.dokinhlac.tamtieu_trai,
            tambao_trai: data.dokinhlac.tambao_trai,
            daitruong_trai: data.dokinhlac.daitruong_trai,
            phe_trai: data.dokinhlac.phe_trai,
            tieutruong_phai: data.dokinhlac.tieutruong_phai,
            tam_phai: data.dokinhlac.tam_phai,
            tamtieu_phai: data.dokinhlac.tamtieu_phai,
            tambao_phai: data.dokinhlac.tambao_phai,
            daitruong_phai: data.dokinhlac.daitruong_phai,
            phe_phai: data.dokinhlac.phe_phai,
            bangquang_trai: data.dokinhlac.bangquang_trai,
            than_trai: data.dokinhlac.than_trai,
            dom_trai: data.dokinhlac.dom_trai,
            vi_trai: data.dokinhlac.vi_trai,
            can_trai: data.dokinhlac.can_trai,
            ty_trai: data.dokinhlac.ty_trai,
            bangquang_phai: data.dokinhlac.bangquang_phai,
            than_phai: data.dokinhlac.than_phai,
            dom_phai: data.dokinhlac.dom_phai,
            vi_phai: data.dokinhlac.vi_phai,
            can_phai: data.dokinhlac.can_phai,
            ty_phai: data.dokinhlac.ty_phai,
          };

          const calDataset = calculateDataset(originDataset);
          console.log(originDataset);
          console.log(calDataset);
          setCalDataset(calDataset);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResult();
  }, [dokinhlac_id, token]); // Thêm token vào dependency array

  const handleBack = () => {
    if (patient) {
      router.push(`/patientdetail?patient_id=${patient.patient_id}`);
    } else {
      router.back();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div id="result-content" className="p-6 bg-white rounded-lg shadow-md" style={{ paddingBottom: '60px' }}>
      {patient && (
        <>
          <h1 className="text-2xl font-semibold mb-4">{patient.patient_name}</h1>
          <div className="mb-4">
            <p className="text-lg"><strong>Số điện thoại:</strong> {patient.patient_phone}</p>
            <p className="text-lg"><strong>Năm sinh:</strong> {patient.patient_year}</p>
            <p className="text-lg"><strong>Giới tính:</strong> {patient.patient_sex}</p>
            <p className="text-lg"><strong>Tiền sử:</strong> {patient.patient_history}</p>
            <p className="text-lg"><strong>Triệu chứng:</strong> {checkData?.symptom}</p>
          </div>
          <div className="space-y-6">
            <ChartComponent data={calDataset} />
            <ColdHeatAnalytic calDataset={calDataset} />
            <BasicAnalytic calDataset={calDataset} />
            <HandToeAnalytic calDataset={calDataset} />
          </div>
          <PDFButtons elementId="result-content" />
          <button onClick={handleBack} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Back</button>

        </>
      )}
    </div>
  );
};

export default Result;
