import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ColdHeatAnalytic = ({ calDataset }) => {
  // Convert calDataset into an array of objects { label, value }
  const dataEntries = Object.entries(calDataset).map(([label, value]) => ({ label, value }));

  // Sort data by value from smallest to largest
  dataEntries.sort((a, b) => a.value - b.value);

  // Create data for the chart
  const labels = dataEntries.map(entry => entry.label);
  const values = dataEntries.map(entry => entry.value);

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(255, 99, 132, 1)'); // Deep red
    gradient.addColorStop(0.5, 'rgba(255, 99, 132, 0.2)'); // Light red
    gradient.addColorStop(0.5, 'rgba(54, 162, 235, 0.2)'); // Light blue
    gradient.addColorStop(1, 'rgba(54, 162, 235, 1)'); // Deep blue
    return gradient;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Values',
        data: values,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }
          return createGradient(ctx, chartArea);
        },
        borderColor: 'rgba(0, 0, 0, 0.5)', // Light black color for the line
        borderWidth: 1, // Thinner line
        fill: true,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false, // Ensure the chart adapts to the container size
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Cold Heat Analytic',
        font: {
          family: 'Inter, sans-serif',
        },
      },
      tooltip: {
        enabled: true,
        bodyFont: {
          family: 'Inter, sans-serif',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#e7e7e7',
          borderDash: [4, 4],
        },
        ticks: {
          color: '#333',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      y: {
        grid: {
          color: (context) => (context.tick.value === 0 ? '#000' : '#e7e7e7'),
          borderDash: (context) => (context.tick.value === 0 ? [] : [4, 4]),
          borderWidth: (context) => (context.tick.value === 0 ? 2 : 1),
        },
        ticks: {
          color: '#333',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
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
            <p className="text-gray-900 text-2xl leading-none font-bold">Cold Heat Analytic</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="w-full min-w-[300px]">
          <div className="relative" style={{ width: '100%', height: '400px' }}>
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdHeatAnalytic;
