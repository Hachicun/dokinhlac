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
      return 'red';
    } else if (Math.abs(value) > 100) {
      return 'orange';
    } else {
      return 'blue';
    }
  };

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Thủ</th>
            <th>Túc</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(data.thu.length, data.tuc.length) }).map((_, index) => (
            <tr key={index}>
              <td style={{ backgroundColor: data.thu[index] ? getColor(data.thu[index].value) : 'transparent' }}>
                {data.thu[index] ? data.thu[index].label : ''}
              </td>
              <td style={{ backgroundColor: data.tuc[index] ? getColor(data.tuc[index].value) : 'transparent' }}>
                {data.tuc[index] ? data.tuc[index].label : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HandToeAnalytic;
