import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import NavigationBar from '../components/NavigationBar';
import HeaderBar from '../components/HeaderBar';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <>
        <HeaderBar /> {/* Thêm AppBar */}
        <div className="pt-16 pb-16 min-h-screen flex flex-col"> {/* Thêm padding-bottom để tránh bị che khuất */}
          <div className="flex-grow">
            <Component {...pageProps} />
          </div>
          <NavigationBar />
        </div>
      </>
    </AuthProvider>
  );
}

export default MyApp;
