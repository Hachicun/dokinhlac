import React from 'react';

const HandToeAnalytic = ({ calDataset }) => {
  const labels = {
    thu: ['Tiểu trường', 'Tâm', 'Tam tiêu', 'Tâm bào', 'Đại trường', 'Phế'],
    tuc: ['Thận', 'Đởm', 'Can', 'Vị', 'Tỳ', 'Bàng quang'],
  };

  const data = {
    thu: [],
    tuc: [],
  };

  // Phân loại dữ liệu thành "thủ" và "túc"
  Object.entries(calDataset).forEach(([key, value]) => {
    if (labels.thu.includes(key)) {
      data.thu.push({ label: key, value });
    } else if (labels.tuc.includes(key)) {
      data.tuc.push({ label: key, value });
    }
  });

  // Sắp xếp theo mức độ từ nặng đến không bệnh
  const sortBySeverity = (a, b) => {
    if (Math.abs(a.value) > Math.abs(b.value)) return -1;
    if (Math.abs(a.value) < Math.abs(b.value)) return 1;
    return 0;
  };

  data.thu.sort(sortBySeverity);
  data.tuc.sort(sortBySeverity);

  // Tạo màu sắc tương ứng với mức độ bệnh
  const getColor = (value) => {
    if (Math.abs(value) > 200) {
      return 'bg-red-100 text-red-800';
    } else if (Math.abs(value) > 100) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Hand Toe Analytic</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border-2 border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider border-2 border-black-300">Thủ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider border-2 border-black-300">Túc</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: Math.max(data.thu.length, data.tuc.length) }).map((_, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className={`px-6 py-4 whitespace-nowrap border-2 border-gray-300 ${data.thu[index] ? getColor(data.thu[index].value) : ''}`}>
                  <span className="font-medium">{data.thu[index] ? data.thu[index].label : ''}</span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap border-2 border-gray-300 ${data.tuc[index] ? getColor(data.tuc[index].value) : ''}`}>
                  <span className="font-medium">{data.tuc[index] ? data.tuc[index].label : ''}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HandToeAnalytic;
