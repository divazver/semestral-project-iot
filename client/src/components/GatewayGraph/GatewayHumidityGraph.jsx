import React from "react";
import {format, parseISO} from 'date-fns';
import {Box} from "@mui/material";
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
        data: measurements.map((measurement) => measurement?.humidity.toFixed(2)),
        borderColor: 'rgb(13, 195, 255)',
        backgroundColor: 'rgba(13, 195, 255, 0.5)',
      },
    ],
  }

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
    scales: {
      y: measurements.length === 0 && {
        ticks: {
          display: false,
          stepSize: 1,
        },
      },
    },
  };

  return <Box sx={{position: 'relative'}}>
    <Line options={options} data={data}/>
    {measurements.length === 0 && <Box sx={{
      position: 'absolute',
      top: '50%',
      right: '50%',
      transform: 'translate3d(50%, -50%, 0)',
      color: (theme) => theme.palette.grey[600],
    }}>
      Empty data set.
    </Box>}
  </Box>;
}

export default GatewayHumidityGraph;
