import React from "react";
import {Box, Tooltip, Typography} from "@mui/material";

const IconInfo = ({icon, value, title, sx}) => {
  const Icon = icon;

  return <Tooltip title={title}>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      ...sx,
    }}>
      <Icon sx={{fontSize: 42, mr: 1}}/>
      <Typography variant={'h5'}>{value}</Typography>
    </Box>
  </Tooltip>;
}

export default IconInfo;
