import Link from 'next/link';
import { useRouter } from 'next/router';

const NavigationBar = () => {
  const router = useRouter();

  return (
    <nav style={styles.nav}>
      <Link href="/" legacyBehavior>
        <a style={router.pathname === '/' ? styles.activeLink : styles.link}>Home</a>
      </Link>
      <Link href="/newcheck" legacyBehavior>
        <a style={router.pathname === '/newcheck' ? styles.activeLink : styles.link}>AddCheck</a>
      </Link>
      <Link href="/guide" legacyBehavior>
        <a style={router.pathname === '/guide' ? styles.activeLink : styles.link}>Guide</a>
      </Link>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    padding: '10px 0',
    borderTop: '1px solid #e7e7e7',
  },
  link: {
    textDecoration: 'none',
    color: '#0070f3',
  },
  activeLink: {
    textDecoration: 'none',
    color: '#0070f3',
    fontWeight: 'bold',
  },
};

export default NavigationBar;
