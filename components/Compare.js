// components/Compare.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { calculateDataset } from '../utils/calculateDataset';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Compare = ({ rawData }) => {
  const [compareData, setCompareData] = useState([]);

  useEffect(() => {
    const datasets = rawData.map((item) => {
      const { dokinhlac_id, patient_id, symptom, ...values } = item;
      const calculatedDataset = calculateDataset(values);
      console.log('Calculated Dataset:', calculatedDataset); // Log calculated dataset
      return calculatedDataset;
    });
    setCompareData(datasets);
  }, [rawData]);

  // Lấy nhãn từ đối tượng dữ liệu đầu tiên
  const labels = compareData.length > 0 ? Object.keys(compareData[0]) : [];
  console.log('Labels:', labels); // Log labels

  // Màu sắc khác nhau cho từng dataset
  const colors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
    'rgba(78, 255, 140, 1)',
    'rgba(255, 99, 255, 1)'
  ];

  // Tạo các bộ dữ liệu để hiển thị trên biểu đồ
  const datasets = compareData.map((data, index) => {
    const values = Object.values(data);
    console.log(`Values for dataset ${index + 1}:`, values); // Log values
    return {
      label: `Dataset ${index + 1}`,
      data: values,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length].replace('1)', '0.2)'),
      fill: false,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Comparison of Selected Dokinhlac IDs',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: (context) => {
              if (context.tick.value === 0) {
                return '#000'; // Màu đậm cho trục y=0
              }
              return 'rgba(0, 0, 0, 0.1)';
            },
            lineWidth: (context) => {
              if (context.tick.value === 0) {
                return 2; // Độ dày đậm cho trục y=0
              }
              return 1;
            },
          },
        },
      },
    },
  };

  console.log('Chart Config:', config); // Log chart config

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <Line {...config} />
    </div>
  );
};

export default Compare;
