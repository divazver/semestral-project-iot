import React from "react";
import {Box, CircularProgress} from "@mui/material";

const Loader = ({message}) => <Box sx={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}}>
  <CircularProgress /> {message && <Box sx={{ml: 3}}>{message}</Box>}
</Box>

export default Loader;
