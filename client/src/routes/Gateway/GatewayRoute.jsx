import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getGateway} from "../../api/gateway/gateway";
import {Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button} from "@mui/material";
import {DateTimePicker, DatePicker} from '@mui/x-date-pickers/DateTimePicker';
import Loader from "components/Loader/Loader";
import GatewayNotFound from "components/GatewayNotFound/GatewayNotFound";
import GatewayTemperatureGraph from "components/GatewayGraph/GatewayTemperatureGraph";
import {GRANULARITY_OPTIONS, GRANULARITY_RANGES} from "utils/constants";
import GatewayDataTable from "components/GatewayDataTable/GatewayDataTable";
import {sub, format, differenceInMinutes} from 'date-fns';
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
  const [granularity, setGranularity] = useState(5);
  const {id} = useParams();

  const changeGranularity = (event) => setGranularity(event.target.value);

  const isGranularityDisabled = (granularity, to, from) => {
    let distanceInMinutes = differenceInMinutes(to, from);

    let granularityRange = GRANULARITY_RANGES[granularity];

    return distanceInMinutes < granularityRange.from || distanceInMinutes > granularityRange.to;
  }

  const getFirstAvailableGranularity = (to, from) =>
    Object.values(GRANULARITY_OPTIONS).find((value) => !isGranularityDisabled(value, to, from))

  const changeRangeValue = (key, value) => {
    let tempRange = {from, to};
    tempRange[key] = value;

    setGranularity(getFirstAvailableGranularity(tempRange.to, tempRange.from));
    setDateRange(tempRange);
  }

  const loadGatewayMeasurements = (id, from, to, granularity) => {
    getMeasurementsByGateway(id, from, to, granularity)
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
        loadGatewayMeasurements(response?.data?._id, from, to);
      }
    })
    .catch((error) => console.log(error))
    .finally(() => setLoading(false));

  useEffect(() => {
    getGatewayInfo(id, from, to, granularity);
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
              disableFuture={true}
              onChange={(value) => changeRangeValue("from", value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DateTimePicker
              label="To"
              value={to}
              disableFuture={true}
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
                {Object.entries(GRANULARITY_OPTIONS).map(([label, granularity], index) =>
                  <MenuItem
                    key={`granularity-${index}`}
                    value={granularity}
                    disabled={isGranularityDisabled(granularity, to, from)}>{label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{
            display: 'flex',
            alignItems: 'center',
            pl: 2,
          }}>
            <Button variant="contained" size={"large"} onClick={() => loadGatewayMeasurements(id, from, to, granularity)}>Get data</Button>
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
