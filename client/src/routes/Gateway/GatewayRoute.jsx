import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getGateway} from "../../api/gateway/gateway";
import {Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {parseISO} from 'date-fns';
import Loader from "components/Loader/Loader";
import GatewayNotFound from "components/GatewayNotFound/GatewayNotFound";
import GatewayGraph from "components/GatewayGraph/GatewayGraph";
import {GRANULARITY_OPTIONS} from "utils/constants";
import GatewayDataTable from "components/GatewayDataTable/GatewayDataTable";

const GatewayRoute = () => {
  const [loading, setLoading] = useState(true);
  const [gateway, setGateway] = useState(undefined);
  const [statistics, setStatistics] = useState([]);
  const [{from, to}, setDateRange] = useState({
    from: parseISO("2023-04-09T13:00"),
    to: parseISO("2023-04-09T14:00"),
  });
  const [granularity, setGranularity] = useState("hourly");
  const {id} = useParams();

  const changeGranularity = (event) => setGranularity(event.target.value);

  const changeRangeValue = (key, value) => {
    let tempRange = {from, to};
    tempRange[key] = value;
    setDateRange(tempRange);
  }

  const getGatewayInfo = (id) => getGateway(id)
    .then((response) => {
      if (response?.data) {
        setGateway(response?.data);
        setStatistics(response?.data?.measurements);
      }
    })
    .catch((error) => console.log(error))
    .finally(() => setLoading(false));

  useEffect(() => {
    getGatewayInfo(id);
  }, [])
  console.log("gateway >>>", gateway)

  return (loading ? <Loader message={"Loading gateway"}/> : <>
    {gateway?.name
      ? <>
        <Typography variant={'h2'} sx={{mb: 2}}>{gateway?.name}</Typography>
        <Typography variant={'body'}>Data for range: <strong>09.04.2023 13:00</strong> - <strong>09.04.2023
          14:00</strong></Typography>
        <Paper
          sx={{
            p: 3,
            mt: 5,
          }}
          elevation={1}
        >
          {/*<GatewayGraph measurements={gateway.measurements} granularity={'hourly'}/>*/}
        </Paper>
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
        {/*<GatewayDataTable measurements={gateway.measurements} />*/}
      </>
      : <GatewayNotFound/>}
  </>);
};

export default GatewayRoute;
