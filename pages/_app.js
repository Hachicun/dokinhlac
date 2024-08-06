import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import NavigationBar from '../components/NavigationBar';
import HeaderBar from '../components/HeaderBar';
import withAuth from '../components/withAuth';
import Banner from '../components/Banner';

function MyApp({ Component, pageProps }) {
  const AuthenticatedComponent = withAuth(Component);

  return (
    <AuthProvider>
      <>
        <HeaderBar /> {/* Thêm AppBar */}
        <Banner />
        <div className="pt-16 pb-16 min-h-screen flex flex-col"> {/* Thêm padding-bottom để tránh bị che khuất */}
          <div className="flex-grow">
            <AuthenticatedComponent {...pageProps} />
          </div>
          <NavigationBar />
        </div>
      </>
    </AuthProvider>
  );
}

export default MyApp;
