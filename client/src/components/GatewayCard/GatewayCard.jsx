import React, {useState} from "react";
import {Box, Button, Skeleton, Paper, Typography, Chip, Stack, Divider} from "@mui/material";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import IconInfo from "../IconInfo/IconInfo";
import {useNavigate} from "react-router-dom";
import UpdateTime from "../UpdateTime/UpdateTime";
import GatewayPinButton from "../GatewayPinButton/GatewayPinButton";
import SimpleGraph from "../SimpleGraph/SimpleGraph";

const availableGraphs = {
  temperature: {
    accessor: "temperature",
    label: "Temperature",
    color: {
      border: 'rgb(244, 224, 77)',
      background: 'rgba(244, 224, 77, 0.5)',
    },
  },
  humidity: {
    accessor: "humidity",
    label: "Humidity",
    color: {
      border: 'rgb(13, 195, 255)',
      background: 'rgba(13, 195, 255, 0.5)',
    },
  },
}

const GatewayCard = ({loaded, gateway}) => {

  const [showedGraph, setShowedGraph] = useState("temperature");

  const getGraphChipVariant = (graph) => graph === showedGraph ? "filled" : "outlined";

  const navigate = useNavigate();

  const onClick = (gatewayId) => {
    navigate(`/gateway/${gatewayId}`)
  }

  const getLastMeasurement = (measurements) => {
    if (loaded && measurements.length > 0) {
      let lastMeasurement = {...measurements[measurements.length - 1]};
      lastMeasurement.temperature = `${lastMeasurement.temperature.toFixed(1)}°`;
      lastMeasurement.humidity = `${lastMeasurement.humidity.toFixed(2)}%`;

      return lastMeasurement;
    }

    return {
      temperature: "N/A",
      humidity: "N/A",
      time: undefined,
    }
  }

  const {time, temperature, humidity} = getLastMeasurement(gateway?.measurements);

  return <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
    }}
    elevation={1}>
    <Box
      sx={{
        position: 'relative',
        margin: '-1rem -1rem 0',
      }}
    >{!loaded ? <Skeleton variant="rounded" sx={{width: '100%', height: 186}}/> :
      <SimpleGraph
        {...availableGraphs[showedGraph]}
        measurements={gateway?.measurements}/>}
      <Box sx={{
        mt: 2,
        px: '1rem',
      }}>
        <Typography variant={"body2"} sx={{mb: 1}}>Data by last hour: </Typography>
        {!loaded ? <Skeleton variant="rounded" width={122} height={32} /> : <Stack direction="row" spacing={1}>
          <Chip label="Temperature"
                onClick={() => setShowedGraph("temperature")}
                variant={getGraphChipVariant("temperature")}
                icon={<ThermostatIcon />}/>
          <Chip label="Humidity"
                onClick={() => setShowedGraph("humidity")}
                variant={getGraphChipVariant("humidity")}
                icon={<WaterDropIcon />}/>
        </Stack>}
      </Box>
      <Divider sx={{mt: 2}} />
    </Box>
    <Box sx={{
      mt: 3,
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
          {!loaded ? <Skeleton variant="text" sx={{fontSize: '.75rem'}}/> : time ?
            <UpdateTime time={time}/> : <Typography variant={'body2'} sx={{
              color: (theme) => theme.palette.grey[600],
            }}>Data is unavailable</Typography>}
          <Typography variant={'h5'}>{gateway?.name}</Typography>
        </Box>
        <GatewayPinButton gatewayId={gateway?._id}/>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        my: 2,
      }}>
        <IconInfo icon={ThermostatIcon} title={"Temperature"}
                  value={!loaded ? <Skeleton variant="text" width={60}
                                             sx={{fontSize: '1rem'}}/> : temperature}
                  sx={{mr: 3}}/>
        <IconInfo icon={WaterDropIcon} title={"Humidity"}
                  value={!loaded ? <Skeleton variant="text" width={60}
                                             sx={{fontSize: '1rem'}}/> : humidity}/>
      </Box>
      <Button variant={'text'} color={'greyLight'} onClick={() => onClick(gateway._id)}>Statistics ></Button>
    </Box>
  </Paper>;
}

export default GatewayCard;
