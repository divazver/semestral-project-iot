import React from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Typography} from "@mui/material";
import LinkOffIcon from '@mui/icons-material/LinkOff';

const GatewayNotFound = () => {
  const navigate = useNavigate();

  return <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      mb: 15,
    }}>
      <LinkOffIcon sx={{fontSize: 120, mt: 7, mb: 2}} />
      <Typography variant={'h3'} sx={{mb: 2}}>The gateway has been not found!</Typography>
      <Typography variant={'body'}>The requested gateway has been not found. Please check the url or return back to the application.</Typography>
      <Button variant={'contained'} color={'primary'} onClick={() => navigate('/')} sx={{mt: 5}}>
        Return back to the application
      </Button>
    </Box>;
}

export default GatewayNotFound;
