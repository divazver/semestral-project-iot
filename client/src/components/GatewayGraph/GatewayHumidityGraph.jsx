import React from "react";
import {format, parseISO} from 'date-fns';
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

const GatewayHumidityGraph = ({measurements, granularity}) => {
  const labels = [...measurements.map((measurement) =>
    format(parseISO(measurement.time), GRANULARITY_TO_TIME[granularity]
      ? GRANULARITY_TO_TIME[granularity]
      : GRANULARITY_TO_TIME.hourly),
  )];
  const data = {
    labels,
    datasets: [
      {
        label: "Humidity",
        data: measurements.map((measurement) => measurement?.humidity),
        borderColor: 'rgb(13, 195, 255)',
        backgroundColor: 'rgba(13, 195, 255, 0.5)',
      },
    ],
  }

  return <Line options={options} data={data}/>;
}

export default GatewayHumidityGraph;
