import React from "react";
import {Box, Button, IconButton, Paper, Typography} from "@mui/material";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import IconInfo from "../IconInfo/IconInfo";
import {useNavigate} from "react-router-dom";
import UpdateTime from "../UpdateTime/UpdateTime";
import GatewayPinButton from "../GatewayPinButton/GatewayPinButton";

const GatewayCard = ({gateway}) => {

  const navigate = useNavigate();

  const onClick = (gatewayId) => {
    navigate(`/gateway/${gatewayId}`)
  }

  console.log(gateway);

  return <Paper
    sx={{
      p: 2,
      height: 200,
      display: 'flex',
      flexDirection: 'column',
    }}
    elevation={1}>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      height: '100%',
    }}>
      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <Box>
          {gateway?.measurements?.time && <UpdateTime time={gateway?.measurements?.time}/>}
          <Typography variant={'h5'}>{gateway?.name}</Typography>
        </Box>
        <GatewayPinButton gatewayId={gateway?._id} />
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <IconInfo icon={ThermostatIcon} title={"Temperature"} value={`${gateway?.measurements?.temperature}°`}
                  sx={{mr: 3}}/>
        <IconInfo icon={WaterDropIcon} title={"Humidity"} value={`${gateway?.measurements?.humidity}%`}/>
      </Box>
      <Button variant={'text'} color={'greyLight'} onClick={() => onClick(gateway._id)}>Statistics ></Button>
    </Box>
  </Paper>;
}

export default GatewayCard;
