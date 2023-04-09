import React from "react";
import {format, formatDistance, parseISO} from 'date-fns';
import {Tooltip, Typography} from "@mui/material";

const UpdateTime = ({time}) => {
  const updateDate = parseISO(time);
  const currentDate = new Date();

  return <Tooltip title={`${format(updateDate, 'HH:mm dd.LL.yyyy')}`}>
    <Typography variant={'body2'} sx={{
      color: (theme) => theme.palette.grey[600],
    }}>Last update: {`${formatDistance(currentDate, new Date(updateDate))}`} ago</Typography>
  </Tooltip>;
};

export default UpdateTime;
