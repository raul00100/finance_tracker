import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CryptoLineGraph({ data, label }) {
  const chartData = {
    labels: data.map(item => item.date), // Dates for the x-axis
    datasets: [
      {
        label: `${label} Price`,
        data: data.map(item => item.price), // Prices for the y-axis
        borderColor: '#27187e',
        backgroundColor: '#758bfd',
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to control height
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${label} Price Over Time`,
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '340px' }}> {/* Set height explicitly */}
      <Line data={chartData} options={options} />
    </div>
  );
}