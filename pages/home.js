import { useRouter } from 'next/router';
import { FaThermometerHalf, FaUsers, FaGrinTongue } from 'react-icons/fa'; // Import các biểu tượng từ React Icons

const Home = () => {
  const router = useRouter();

  const handleAddCheck = () => {
    router.push('/newcheck');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="flex justify-around w-full max-w-3xl mt-16">
        <div
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition-colors duration-300"
          onClick={handleAddCheck}
        >
          <FaThermometerHalf size={100} className="text-red-500" />
          <p className="mt-4 text-lg font-semibold">Đo kinh lạc</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-green-100 transition-colors duration-300">
          <FaUsers size={100} className="text-green-500" />
          <p className="mt-4 text-lg font-semibold">Vấn chẩn</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-yellow-100 transition-colors duration-300">
          <FaGrinTongue size={100} className="text-yellow-500" />
          <p className="mt-4 text-lg font-semibold">Thiệt chẩn</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
