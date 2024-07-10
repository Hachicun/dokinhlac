import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaUserAlt, FaBook } from 'react-icons/fa';

const NavigationBar = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        <Link href="/patient" legacyBehavior>
          <a className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${router.pathname === '/patient' ? 'text-blue-600' : 'text-gray-500'}`}>
            <FaUserAlt className="w-5 h-5 mb-2" />
            <span className="text-sm">Bệnh nhân</span>
          </a>
        </Link>
        <Link href="/home" legacyBehavior>
          <a className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${router.pathname === '/home' ? 'text-blue-600' : 'text-gray-500'}`}>
            <FaHome className="w-5 h-5 mb-2" />
            <span className="text-sm">Trang chủ</span>
          </a>
        </Link>
        <Link href="/guide" legacyBehavior>
          <a className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${router.pathname === '/guide' ? 'text-blue-600' : 'text-gray-500'}`}>
            <FaBook className="w-5 h-5 mb-2" />
            <span className="text-sm">Hướng dẫn</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
