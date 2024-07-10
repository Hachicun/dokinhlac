import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Spinner from '../components/Spinner';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/patient');
  }, [router]);

  return <Spinner />; // Hiển thị Spinner trong khi chờ chuyển hướng
};

export default Home;
