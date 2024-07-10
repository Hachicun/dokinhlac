import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { calculateDataset } from '../utils/calculateDataset';
import { parseISO, format } from 'date-fns';
import 'chart.js/auto';

const Compare = ({ rawData = [] }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const customLabels = ["TTr", "Tâm", "3T", "TBL", "Đtr", "Phế", "BQ", "Thận", "Đởm", "Vị", "Can", "Tỳ"];
    
    // Danh sách các màu khác nhau
    const colors = [
      '#00E396', '#0090FF', '#FF4560', '#775DD0', '#FEB019', '#FF66C3', '#33B2DF', '#546E7A',
      '#D4526E', '#13D8AA', '#A5978B', '#2B908F', '#F9A3A4', '#90EE7E', '#FA4443', '#69D2E7'
    ];

    if (rawData.length > 0) {
      const datasets = rawData.map((item, index) => {
        const { created_at, ...values } = item;
        const calculatedDataset = calculateDataset(values);
        const color = colors[index % colors.length]; // Lấy màu từ danh sách

        return {
          label: format(parseISO(created_at), 'HH:mm dd/MM/yyyy'), // Đổi định dạng thành 'HH:mm dd/MM/yyyy'
          data: Object.values(calculatedDataset),
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2,
          pointBackgroundColor: '#FFF',
          pointBorderColor: color,
          pointHoverRadius: 5,
          pointRadius: 3,
          tension: 0.4, // Thêm thuộc tính tension để tạo đường cong mềm mại
        };
      });

      setChartData({
        labels: customLabels,
        datasets: datasets,
      });

      setChartOptions({
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            rtl: false,
            align: 'right',
            labels: {
              usePointStyle: false, // Đặt thành false để tô màu toàn bộ hình tròn
              boxWidth: 12,
              boxHeight: 12,
            },
          },
          tooltip: {
            enabled: false, // Disable tooltip
          },
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          x: {
            title: {
              display: false,
              text: 'Values',
            },
            ticks: {
              callback: function (value) {
                return value.toFixed(0);
              },
            },
            grid: {
              color: function (context) {
                return context.tick.value === 0 ? '#000' : '#e7e7e7';
              },
              lineWidth: function (context) {
                return context.tick.value === 0 ? 0.5 : 1;
              },
            },
          },
          y: {
            title: {
              display: false,
              text: 'Parameters',
            },
            ticks: {
              callback: function (value, index) {
                return customLabels[index]; // Display labels on y-axis
              },
            },
            // grid: {
            //   color: function(context) {
            //     return context.tick.value === 0 ? '#000' : '#e7e7e7';
            //   },
            //   lineWidth: function(context) {
            //     return context.tick.value === 0 ? 2 : 1;
            //   },
            // },
          },
        },
        elements: {
          point: {
            radius: 3,
            hoverRadius: 5,
          },
        },
      });
    }
  }, [rawData]);

  return (
    <div className="max-w-full w-full bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <div className="grid gap-4 grid-cols-2">
          <div>
            <h5 className="inline-flex items-center text-gray-500 leading-none font-normal mb-2">
              So sánh
            </h5>
            <p className="text-gray-900 text-2xl leading-none font-bold">Biểu đồ</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div style={{ width: '100%', height: '600px' }}> {/* Adjust the height as needed */}
          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;
