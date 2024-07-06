import { FaBell, FaSearch, FaCog } from 'react-icons/fa';

const AppBar = () => {
  return (
    <div className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Đo Kinh Lạc</h1>
            <span className="ml-3 text-sm text-gray-500">@Lục Khí</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <FaSearch className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <FaBell className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <FaCog className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
