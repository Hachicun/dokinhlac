import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const BasicAnalytic = ({ calDataset }) => {
  const organCategories = {
    tang: ['Tâm', 'Tâm bào', 'Phế', 'Thận', 'Can', 'Tỳ'],
    phu: ['Tiểu trường', 'Tam tiêu', 'Đại trường', 'Bàng quang', 'Đởm', 'Vị'],
  };

  const organData = {
    tang: { nặng: 0, nhẹ: 0, không_bệnh: 0, tổng: 0 },
    phu: { nặng: 0, nhẹ: 0, không_bệnh: 0, tổng: 0 },
  };

  Object.entries(calDataset).forEach(([key, value]) => {
    if (organCategories.tang.includes(key)) {
      if (Math.abs(value) > 200) {
        organData.tang.nặng += 1;
      } else if (Math.abs(value) > 100) {
        organData.tang.nhẹ += 1;
      } else {
        organData.tang.không_bệnh += 1;
      }
      organData.tang.tổng += 1;
    } else if (organCategories.phu.includes(key)) {
      if (Math.abs(value) > 200) {
        organData.phu.nặng += 1;
      } else if (Math.abs(value) > 100) {
        organData.phu.nhẹ += 1;
      } else {
        organData.phu.không_bệnh += 1;
      }
      organData.phu.tổng += 1;
    }
  });

  const totalData = {
    nặng: organData.tang.nặng + organData.phu.nặng,
    nhẹ: organData.tang.nhẹ + organData.phu.nhẹ,
    không_bệnh: organData.tang.không_bệnh + organData.phu.không_bệnh,
    tổng: organData.tang.tổng + organData.phu.tổng,
  };

  const doughnutData = {
    labels: ['Nặng', 'Nhẹ', 'Không bệnh'],
    datasets: [
      {
        data: [totalData.nặng, totalData.nhẹ, totalData.không_bệnh],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Tạng', 'Phủ'],
    datasets: [
      {
        label: 'Nặng',
        data: [organData.tang.nặng, organData.phu.nặng],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Nhẹ',
        data: [organData.tang.nhẹ, organData.phu.nhẹ],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Không bệnh',
        data: [organData.tang.không_bệnh, organData.phu.không_bệnh],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th>Nặng</th>
            <th>Nhẹ</th>
            <th>Không bệnh</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tạng</td>
            <td>{organData.tang.nặng}</td>
            <td>{organData.tang.nhẹ}</td>
            <td>{organData.tang.không_bệnh}</td>
            <td>{organData.tang.tổng}</td>
          </tr>
          <tr>
            <td>Phủ</td>
            <td>{organData.phu.nặng}</td>
            <td>{organData.phu.nhẹ}</td>
            <td>{organData.phu.không_bệnh}</td>
            <td>{organData.phu.tổng}</td>
          </tr>
          <tr>
            <td>Tổng</td>
            <td>{totalData.nặng}</td>
            <td>{totalData.nhẹ}</td>
            <td>{totalData.không_bệnh}</td>
            <td>{totalData.tổng}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ width: '400px', margin: '0 auto' }}>
        <Doughnut data={doughnutData} />
      </div>
      <div style={{ width: '400px', margin: '0 auto' }}>
        <Bar
          data={barData}
          options={{
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Tạng và Phủ' },
            },
            scales: { x: { stacked: true }, y: { stacked: true } },
          }}
        />
      </div>
    </div>
  );
};

export default BasicAnalytic;
