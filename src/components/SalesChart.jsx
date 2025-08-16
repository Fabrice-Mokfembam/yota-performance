import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Sales by Category ($)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 16000,
        ticks: {
          stepSize: 2000,
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Sales ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Category'
        }
      }
    }
  };

  const data = {
    labels: ['Exhaust', 'Wheels', 'Suspension', 'Lighting', 'Bumpers'],
    datasets: [
      {
        data: [13500, 11000, 7500, 4000, 2500],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Highest Selling Categories</h3>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default SalesChart; 