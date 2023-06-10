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
import {Box} from '@mui/material';
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

const SimpleGraph = ({measurements, label, accessor, color}) => {
  const labels = [...measurements.map((measurement) =>
    format(parseISO(measurement.time), GRANULARITY_TO_TIME.hourly),
  )];

  const values = measurements.map((measurement) => measurement[accessor]);
  const minValue = Math.floor(Math.min.apply(null, values)) - .5;
  const maxValue = Math.ceil(Math.max.apply(null, values)) + .5;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        //position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: minValue,
        max: maxValue,
        ticks: {
          display: false,
          stepSize: .5,
        },
      },
      x: {
        ticks: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor: color.border,
        backgroundColor: color.background,
      },
    ],
  }

  return <Box sx={{position: 'relative'}}>
    <Line options={options} data={data}/>
    {values.length === 0 && <Box sx={{
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

export default SimpleGraph;
