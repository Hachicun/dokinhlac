// components/PatientHistorySelector.js
import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';

const PatientHistorySelector = ({ onHistoryChange }) => {
  const [diseaseList, setDiseaseList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Đọc file CSV và phân tích dữ liệu
    Papa.parse('/vn_diseases.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setDiseaseList(results.data);
      }
    });

    const handleResize = () => {
      if (searchInputRef.current) {
        searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 2) {  // Chỉ tìm kiếm khi từ khóa dài hơn 2 ký tự
      const results = diseaseList.filter(disease => 
        disease.VN_name && disease.VN_name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results.slice(0, 10)); // Chỉ hiển thị 10 kết quả đầu tiên
    } else {
      setSearchResults([]);
    }
  };

  const handleSelect = (item) => {
    if (!selectedItems.some(selected => selected.Disease_id === item.Disease_id)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      onHistoryChange(newSelectedItems.map(i => i.VN_name).join(', '));
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleAddCustomItem = () => {
    const customItem = { Disease_id: searchTerm, VN_name: searchTerm };
    handleSelect(customItem);
  };

  const handleRemove = (item) => {
    const newSelectedItems = selectedItems.filter(i => i.Disease_id !== item.Disease_id);
    setSelectedItems(newSelectedItems);
    onHistoryChange(newSelectedItems.map(i => i.VN_name).join(', '));
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">Tìm kiếm và chọn</label>
      <div className="flex items-center">
        <input
          id="disease-search-input"
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Nhập vào đây"
          onFocus={() => {
            setTimeout(() => {
              if (searchInputRef.current) {
                searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 300); // delay to allow keyboard to open
          }}
        />
        <button
          type="button"
          onClick={handleAddCustomItem}
          className="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Thêm
        </button>
      </div>
      <ul className="mt-2">
        {searchResults.map((disease, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`disease-${disease.Disease_id}`}
              onChange={() => handleSelect(disease)}
              checked={selectedItems.some(item => item.Disease_id === disease.Disease_id)}
            />
            <label htmlFor={`disease-${disease.Disease_id}`} className="text-sm text-gray-700">{disease.VN_name}</label>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-900">Bệnh và triệu chứng đã chọn</label>
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">{item.VN_name}</span>
              <button type="button" onClick={() => handleRemove(item)} className="text-red-500">Xóa</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientHistorySelector;
