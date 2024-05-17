import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { calculateDataset } from '../utils/calculateDataset';
import dynamic from 'next/dynamic';

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

  useEffect(() => {
    const fetchResult = async () => {
      if (dokinhlac_id) {
        try {
          const res = await fetch(`/api/result?dokinhlac_id=${encodeURIComponent(dokinhlac_id)}`);
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
          setCalDataset(calDataset);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResult();
  }, [dokinhlac_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {patient && (
        <>
          <h1>{patient.patient_name}</h1>
          <p>Phone: {patient.patient_phone}</p>
          <p>History: {patient.patient_history}</p>
          <p>Symptom: {checkData.symptom}</p>
          <h2>Check Results</h2>
          <ul>
            {Object.entries(checkData).filter(([key]) => key !== 'symptom' && key !== 'patient_id' && key !== 'dokinhlac_id').map(([key, value]) => (
              <li key={key}>{key.replace(/_/g, ' ')}: {value}</li>
            ))}
          </ul>
          {calDataset && (
            <>
              <h2>Calculated Dataset</h2>
              <ul>
                {Object.entries(calDataset).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.toFixed(2)}
                  </li>
                ))}
              </ul>
              <ChartComponent data={calDataset} />

              <BasicAnalytic calDataset={calDataset} />
              <HandToeAnalytic calDataset={calDataset} />
              <ColdHeatAnalytic calDataset={calDataset} />


            </>
          )}
        </>
      )}
    </div>
  );
};

export default Result;
