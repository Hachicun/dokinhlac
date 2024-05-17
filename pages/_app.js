import { AuthProvider } from '../contexts/AuthContext';
import NavigationBar from '../components/NavigationBar';

//import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <>
        <Component {...pageProps} />
        <NavigationBar />
      </>
    </AuthProvider>
  );
}

export default MyApp;
