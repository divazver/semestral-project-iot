import React, {useEffect, useState} from "react";
import {Alert, Grid, Typography} from '@mui/material';
import {useOutletContext} from "react-router-dom";
import {getAllGateways} from "../api/gateway/gateway";
import Loader from "components/Loader/Loader";
import GatewayCard from "components/GatewayCard/GatewayCard";
import {mapGateways} from "../utils/gateways";
import {useApp} from "../utils/hooks/useAppState";

const Dashboard = () => {
  const [, setPageTitle] = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [gateways, setGateways] = useState([]);
  const {pinnedGateways, setPinnedGateways} = useApp();
  const [gatewaysObjects, setGatewaysObjects] = useState([]);
  const [pinnedGatewaysObjects, setPinnedGatewaysObjects] = useState([]);

  const getGateways = () => getAllGateways()
    .then((response) => {
      setGateways(response?.data);
    })
    .catch((error) => console.log(error))
    .finally(() => setLoading(false));

  useEffect(() => {
    setPageTitle('Dashboard');
    getGateways();
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
          <Grid item xs={4} key={`gateway-${index}`}><GatewayCard gateway={gateway}/></Grid>)
      }</Grid>
      : <Alert severity={"info"}>You have not favorite gateways.</Alert>}
    <Typography variant={'h2'} sx={{mb: 3, mt: 8}}>Gateways</Typography>

    {gatewaysObjects.length > 0 ?
      <Grid container spacing={2}>{
        gatewaysObjects.map((gateway, index) =>
          <Grid item xs={4} key={`gateway-${index}`}><GatewayCard gateway={gateway}/></Grid>)
      }</Grid>
      : <Alert severity={"info"}>
        {pinnedGatewaysObjects?.length === 0 ? "You have not gateways." : "Each gateway has been marked as favorite."}
      </Alert>}
  </>);
};

export default Dashboard;
