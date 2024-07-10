import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser && router.pathname !== '/login') {
        router.push('/login');
      }
    }, [currentUser, router]);

    if (!currentUser && router.pathname !== '/login') {
      return null; // Hoặc hiển thị một spinner/loading gì đó
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
