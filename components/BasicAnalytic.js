import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';

// Dynamically import ApexCharts
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

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

  const doughnutOptions = {
    chart: {
      type: 'donut',
      height: 400,
    },
    labels: ['Nặng', 'Nhẹ', 'Không bệnh'],
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
    },
    colors: ['#FF6384', '#FFCE56', '#36A2EB'],
  };

  const doughnutSeries = [totalData.nặng, totalData.nhẹ, totalData.không_bệnh];

  const barOptions = {
    chart: {
      type: 'bar',
      height: 400,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
      },
    },
    xaxis: {
      categories: ['Tạng', 'Phủ'],
      labels: {
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(0),
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        },
      },
    },
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: '#e7e7e7',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
          style: {
            colors: ['#e7e7e7', '#000'],
            lineWidth: 2,
          },
        },
      },
    },
  };

  const barSeries = [
    {
      name: 'Nặng',
      data: [organData.tang.nặng, organData.phu.nặng],
      color: 'rgba(255, 99, 132, 0.8)',
    },
    {
      name: 'Nhẹ',
      data: [organData.tang.nhẹ, organData.phu.nhẹ],
      color: 'rgba(255, 206, 86, 0.8)',
    },
    {
      name: 'Không bệnh',
      data: [organData.tang.không_bệnh, organData.phu.không_bệnh],
      color: 'rgba(54, 162, 235, 0.8)',
    },
  ];

  return (
    <div className="max-w-full w-full bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <div className="grid gap-4 grid-cols-2">
          <div>
            <h5 className="inline-flex items-center text-gray-500 leading-none font-normal mb-2">
              Analytics
            </h5>
            <p className="text-gray-900 text-2xl leading-none font-bold">Chart</p>
          </div>
        </div>
      </div>
      <table className="w-full mb-6 border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold text-gray-700">Loại</th>
            <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold text-gray-700">Nặng</th>
            <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold text-gray-700">Nhẹ</th>
            <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold text-gray-700">Không bệnh</th>
            <th className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold text-gray-700">Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="px-4 py-2 border border-gray-300">Tạng</td>
            <td className="px-4 py-2 border border-gray-300">{organData.tang.nặng}</td>
            <td className="px-4 py-2 border border-gray-300">{organData.tang.nhẹ}</td>
            <td className="px-4 py-2 border border-gray-300">{organData.tang.không_bệnh}</td>
            <td className="px-4 py-2 border border-gray-300">{organData.tang.tổng}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="px-4 py-2 border border-gray-300">Phủ</td>
            <td className="px-4 py-2 border border-gray-300">{organData.phu.nặng}</td>
            <td className="px-4 py-2 border border-gray-300">{organData.phu.nhẹ}</td>
            <td className="px-4 py-2 border border-gray-300">{organData.phu.không_bệnh}</td>
            <td className="px-4 py-2 border border-gray-300">{organData.phu.tổng}</td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="px-4 py-2 border border-gray-300">Tổng</td>
            <td className="px-4 py-2 border border-gray-300">{totalData.nặng}</td>
            <td className="px-4 py-2 border border-gray-300">{totalData.nhẹ}</td>
            <td className="px-4 py-2 border border-gray-300">{totalData.không_bệnh}</td>
            <td className="px-4 py-2 border border-gray-300">{totalData.tổng}</td>
          </tr>
        </tbody>
      </table>
      <div className="overflow-x-auto mb-6">
        <div id="doughnut-chart">
          <ApexCharts options={doughnutOptions} series={doughnutSeries} type="donut" height={400} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <div id="bar-chart">
          <ApexCharts options={barOptions} series={barSeries} type="bar" height={400} />
        </div>
      </div>
    </div>
  );
};

export default BasicAnalytic;
