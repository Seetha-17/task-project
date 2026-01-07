import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJs.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short' }; // Format options
    return new Date(date).toLocaleDateString('en-GB', options).replace(/\./g, ''); // Remove the dot from abbreviated month
  }
  

function Graph({ arrayOfHoursAndDate }) {
  const labels = arrayOfHoursAndDate.map(item => formatDate(item.date));
  const data = arrayOfHoursAndDate.map(item => item.studyHours);

  // Prepare the data object for the chart
  const linearData = {
    labels,  // Set labels as formatted dates
    datasets: [
      {
        label: 'Study Hours',  // Set label to "Study Hours"
        data,  // Use the study hours as the dataset
        borderColor: 'rgb(98, 255, 0)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Study Hours Over Time',  // Title of the graph
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove vertical grid lines
        },
        ticks: {
          color: 'blue', // Label color
          font: {
            size: 14, // Font size
            family: 'Arial', // Font family
            weight: 'bold', // Font weight
          },
        },
      },
      y: {
        grid: {
          display: false, // Remove horizontal grid lines
        },
        ticks: {
          color: 'red', // Label color
          font: {
            size: 14, // Font size
            family: 'Courier New', // Font family
            weight: 'bold', // Font weight
          },
        },
      },
    },
  };

  return (
    <div>
      <Line options={options} data={linearData}/>
    </div>
  );
}

export default Graph;
