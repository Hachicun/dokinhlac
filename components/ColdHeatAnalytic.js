import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ColdHeatAnalytic = ({ calDataset }) => {
  // Chuyển đổi calDataset thành một mảng các đối tượng { label, value }
  const dataEntries = Object.entries(calDataset).map(([label, value]) => ({ label, value }));

  // Sắp xếp dữ liệu theo giá trị từ nhỏ đến lớn
  dataEntries.sort((a, b) => a.value - b.value);

  // Tạo dữ liệu cho biểu đồ
  const labels = dataEntries.map(entry => entry.label);
  const values = dataEntries.map(entry => entry.value);

  // Tạo màu sắc dựa trên giá trị
  const backgroundColors = values.map(value => (value > 0 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(54, 162, 235, 0.2)'));
  const borderColors = values.map(value => (value > 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Values',
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cold Heat Analytic',
      },
    },
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ColdHeatAnalytic;
