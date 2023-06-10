import React, {useEffect, useState} from "react";
import {Alert, Grid, Typography} from '@mui/material';
import {useOutletContext} from "react-router-dom";
import {getAllGateways} from "../api/gateway/gateway";
import Loader from "components/Loader/Loader";
import GatewayCard from "components/GatewayCard/GatewayCard";
import {mapGateways} from "../utils/gateways";
import {useApp} from "../utils/hooks/useAppState";
import {getMeasurementsByGateway} from "../api/measurement/measurement";
import {formatISO, sub} from 'date-fns';
import {getRoundedDate} from "../utils/utils";

const Dashboard = () => {
  const [, setPageTitle] = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [loadingMetaData, setLoadingMetaData] = useState(true);
  const [gateways, setGateways] = useState([]);
  const {pinnedGateways, setPinnedGateways} = useApp();
  const [gatewaysObjects, setGatewaysObjects] = useState([]);
  const [pinnedGatewaysObjects, setPinnedGatewaysObjects] = useState([]);

  const getGatewayMeasurements = (gateways, gatewayId, dateFrom, dateTo) =>
    getMeasurementsByGateway(gatewayId, dateFrom, dateTo)
      .then((response) => {
        if (response?.data) {
          let tempGateways = [...gateways];
          let index = tempGateways.findIndex((gateway) => gateway._id === gatewayId);

          if (index >= 0) {
            tempGateways[index].measurements = response?.data;
            tempGateways[index].loaded = true;
            setGateways(tempGateways);
          }
        }
      })
      .catch((error) => {
        let tempGateways = [...gateways];
        let index = tempGateways.findIndex((gateway) => gateway._id === gatewayId);
        tempGateways[index].loaded = true;
        tempGateways[index].measurements = [];
        setGateways(tempGateways);

        console.log(error);
      })
      .finally(() => setLoadingMetaData(false));

  const getGateways = () => getAllGateways()
    .then((response) => {
      if (response?.data) {
        let gateways = response?.data.map((gateway) => {
          gateway.loaded = false;

          return gateway;
        });

        const currentRoundedTime = getRoundedDate(5, new Date());

        const {dateFrom, dateTo} = {
          dateFrom: sub(currentRoundedTime, {minutes: 50}),
          dateTo: currentRoundedTime,
        };

        gateways.forEach((gateway) => {
          getGatewayMeasurements(gateways, gateway._id, dateFrom, dateTo);
        });

        setGateways(gateways);
      }
    })
    .catch((error) => console.log(error))
    .finally(() => setLoading(false));

  useEffect(() => {
    setPageTitle('Dashboard');
    getGateways();

    const interval = setInterval(() => {
      setLoadingMetaData(true);
      getGateways();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let [gatewaysTemp, pinnedGatewaysTemp] = mapGateways(gateways, pinnedGateways);

    setPinnedGatewaysObjects(pinnedGatewaysTemp);
    setGatewaysObjects(gatewaysTemp);
  }, [gateways, pinnedGateways]);

  return (loading ? <Loader message={"Loading gateways..."}/> : <>
    <Typography variant={'h2'} sx={{mb: 3}}>Favorites</Typography>

    {pinnedGatewaysObjects.length > 0 ?
      <Grid container spacing={2}>{
        pinnedGatewaysObjects.map((gateway, index) =>
          <Grid item xs={12} sm={6} md={4} key={`gateway-${index}`}><GatewayCard loaded={gateway?.loaded && !loadingMetaData}
                                                                  gateway={gateway}/></Grid>)
      }</Grid>
      : <Alert severity={"info"}>You have not favorite gateways.</Alert>}
    <Typography variant={'h2'} sx={{mb: 3, mt: 8}}>Gateways</Typography>

    {gatewaysObjects.length > 0 ?
      <Grid container spacing={2}>{
        gatewaysObjects.map((gateway, index) =>
          <Grid item xs={12} sm={6} md={4} key={`gateway-${index}`}><GatewayCard loaded={gateway?.loaded && !loadingMetaData}
                                                                  gateway={gateway}/></Grid>)
      }</Grid>
      : <Alert severity={"info"}>
        {pinnedGatewaysObjects?.length === 0 ? "You have not gateways." : "Each gateway has been marked as favorite."}
      </Alert>}
  </>);
}

export default Dashboard;
