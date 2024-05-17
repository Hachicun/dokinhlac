// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/patient');
  }, [router]);

  return null; // Có thể hiển thị một loader hoặc thông báo chờ
};

export default Home;
