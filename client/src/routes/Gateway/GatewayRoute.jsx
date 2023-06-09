import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getGateway} from "../../api/gateway/gateway";
import {Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {parseISO} from 'date-fns';
import Loader from "components/Loader/Loader";
import GatewayNotFound from "components/GatewayNotFound/GatewayNotFound";
import GatewayTemperatureGraph from "components/GatewayGraph/GatewayTemperatureGraph";
import {GRANULARITY_OPTIONS} from "utils/constants";
import GatewayDataTable from "components/GatewayDataTable/GatewayDataTable";
import {sub, format} from 'date-fns';
import {getMeasurementsByGateway} from "../../api/measurement/measurement";
import {getRoundedDate} from "../../utils/utils";
import GatewayHumidityGraph from "../../components/GatewayGraph/GatewayHumidityGraph";

const GatewayRoute = () => {
  const [loading, setLoading] = useState(true);
  const [gateway, setGateway] = useState(undefined);
  const [statistics, setStatistics] = useState([]);

  const currentRoundedTime = getRoundedDate(5, new Date());
  const [{from, to}, setDateRange] = useState({
    from: sub(currentRoundedTime, {minutes: 50}),
    to: currentRoundedTime,
  });
  const [granularity, setGranularity] = useState("hourly");
  const {id} = useParams();

  const changeGranularity = (event) => setGranularity(event.target.value);

  const changeRangeValue = (key, value) => {
    let tempRange = {from, to};
    tempRange[key] = value;
    setDateRange(tempRange);
  }

  const loadGatewayMeasurements = (id, from, to) => {
    getMeasurementsByGateway(id, from, to)
      .then((response) => {
        if (response?.data) {
          setStatistics(response?.data);
        }
      })
  }

  const getGatewayInfo = (id, from, to) => getGateway(id)
    .then((response) => {
      if (response?.data) {
        setGateway(response?.data);
        console.log(from, to, currentRoundedTime);
        loadGatewayMeasurements(response?.data?._id, from, to);
      }
    })
    .catch((error) => console.log(error))
    .finally(() => setLoading(false));

  useEffect(() => {
    getGatewayInfo(id, from, to);
  }, [id])

  return (loading ? <Loader message={"Loading gateway"}/> : <>
    {gateway?.name
      ? <>
        <Typography variant={'h2'} sx={{mb: 2}}>{gateway?.name}</Typography>
        <Typography variant={'body'}>Data for range:
          &nbsp;<strong>{format(from, "dd.MM.y HH:mm")}</strong>
          &nbsp;- <strong>{format(to, "dd.MM.y HH:mm:ss")}</strong>
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper
              sx={{
                p: 3,
                mt: 5,
              }}
              elevation={1}
            >
              {<GatewayTemperatureGraph measurements={statistics}/>}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              sx={{
                p: 3,
                mt: 5,
              }}
              elevation={1}
            >
              {<GatewayHumidityGraph measurements={statistics}/>}
            </Paper>
          </Grid>
        </Grid>
        <Grid container sx={{mt: 5}}>
          <Grid item xs={12} sm={6} md={3}>
            <DateTimePicker
              label="From"
              value={from}
              onChange={(value) => changeRangeValue("from", value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DateTimePicker
              label="To"
              value={to}
              onChange={(value) => changeRangeValue("to", value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="granularity-select-label">Granularity</InputLabel>
              <Select
                labelId="granularity-select-label"
                id="granularity-select"
                value={granularity}
                label="Granularity"
                onChange={changeGranularity}
              >
                {GRANULARITY_OPTIONS.map((granularity, index) =>
                  <MenuItem key={`granularity-${index}`} value={granularity}>{granularity}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant={'h4'} sx={{mt: 5, mb: 2}}>Data table</Typography>
        {<GatewayDataTable measurements={statistics}/>}
      </>
      : <GatewayNotFound/>}
  </>);
}
;

export default GatewayRoute;
