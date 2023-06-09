import React, {useState} from "react";
import {format, formatDistance, parseISO} from 'date-fns';
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
import {Line} from 'react-chartjs-2';
import {GRANULARITY_TO_TIME} from "../../utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
    },
  },
};

const GatewayTemperatureGraph = ({measurements, granularity}) => {
  const labels = [...measurements.map((measurement) =>
    format(parseISO(measurement.time), GRANULARITY_TO_TIME[granularity]
      ? GRANULARITY_TO_TIME[granularity]
      : GRANULARITY_TO_TIME.hourly),
  )];
  const data = {
    labels,
    datasets: [
      {
        label: "Temperature",
        data: measurements.map((measurement) => measurement?.temperature),
        borderColor: 'rgb(244, 224, 77)',
        backgroundColor: 'rgba(244, 224, 77, 0.5)',
      },
    ],
  }

  return <Line options={options} data={data}/>;
}

export default GatewayTemperatureGraph;
