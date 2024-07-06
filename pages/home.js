import { useRouter } from 'next/router';
import { FaThermometerHalf, FaUsers, FaRegSmileBeam } from 'react-icons/fa'; // Import các biểu tượng từ React Icons

const Home = () => {
  const router = useRouter();

  const handleAddCheck = () => {
    router.push('/newcheck');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '50px' }}>
      <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleAddCheck}>
        <FaThermometerHalf size={100} />
        <p>Đo kinh lạc</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <FaUsers size={100} />
        <p>Vấn chẩn</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <FaRegSmileBeam size={100} />
        <p>Thiệt chẩn</p>
      </div>
    </div>
  );
};

export default Home;
