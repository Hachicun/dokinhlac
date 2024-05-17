import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ data }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Determine the background color for each bar based on the value
  const backgroundColors = values.map(value => {
    if (Math.abs(value) > 200) {
      return 'rgba(255, 99, 132, 0.2)'; // Red for severe condition
    } else if (Math.abs(value) > 100) {
      return 'rgba(255, 206, 86, 0.2)'; // Yellow for mild condition
    } else {
      return 'rgba(54, 162, 235, 0.2)'; // Blue for normal condition
    }
  });

  const borderColors = values.map(value => {
    if (Math.abs(value) > 200) {
      return 'rgba(255, 99, 132, 1)'; // Red for severe condition
    } else if (Math.abs(value) > 100) {
      return 'rgba(255, 206, 86, 1)'; // Yellow for mild condition
    } else {
      return 'rgba(54, 162, 235, 1)'; // Blue for normal condition
    }
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Percent',
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // This makes the bar chart horizontal
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Calculated Dataset',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ChartComponent;
