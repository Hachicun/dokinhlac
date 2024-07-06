import React from 'react';
import dynamic from 'next/dynamic';
import 'apexcharts/dist/apexcharts.css';

// Dynamically import ApexCharts
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const ChartComponent = ({ data }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Determine the background color for each bar based on the value
  const colors = values.map(value => {
    if (Math.abs(value) > 200) {
      return '#FF6384'; // Red for severe condition
    } else if (Math.abs(value) > 100) {
      return '#FFCE56'; // Yellow for mild condition
    } else {
      return '#36A2EB'; // Blue for normal condition
    }
  });

  const chartData = {
    series: [
      {
        name: 'Percent',
        data: values,
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          colors: {
            ranges: [
              {
                from: -Infinity,
                to: -200,
                color: '#FF6384',
              },
              {
                from: -200,
                to: -100,
                color: '#FFCE56',
              },
              {
                from: -100,
                to: Infinity,
                color: '#36A2EB',
              },
            ],
          },
        },
      },
      colors,
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            colors: '#333',
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: true,
          color: '#333',
        },
        axisTicks: {
          show: true,
          color: '#333',
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#333',
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: true,
          color: '#333',
        },
        axisTicks: {
          show: true,
          color: '#333',
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        strokeDashArray: 4,
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        position: 'top',
      },
      title: {
        text: 'Calculated Dataset',
        align: 'center',
      },
    },
  };

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
      <div className="overflow-x-auto">
        <div id="bar-chart">
          <ApexCharts options={chartData.options} series={chartData.series} type="bar" height={300} />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
