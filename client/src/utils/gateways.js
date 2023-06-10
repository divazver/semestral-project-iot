export const isGatewayPinned = (gatewayId, pinnedGateways) => pinnedGateways.includes(gatewayId);

export const pinGateway = (gatewayId, gateways) => {
  let pinnedGateways = [...gateways];
  pinnedGateways.push(gatewayId);

  return pinnedGateways;
}

export const unpinGateway = (gatewayId, gateways) => {
  let pinnedGateways = [...gateways];
  pinnedGateways = pinnedGateways.filter((gateway) => gateway !== gatewayId);

  return pinnedGateways;
}

export const getGatewayLastMeasurements = (gateway) =>
  gateway?.measurements?.length > 0 ? gateway?.measurements[gateway?.measurements.length - 1] : null;

export const mapGateways = (gateways, pinnedGateways) => {
  let gatewaysTemp = [];
  let pinnedGatewaysTemp = [];
  if (gateways?.length > 0) {
    gateways?.forEach((gateway) => {
      let tempGateway = {...gateway};
      if (isGatewayPinned(tempGateway._id, pinnedGateways)) {
        //tempGateway.measurements = getGatewayLastMeasurements(tempGateway);
        pinnedGatewaysTemp.push(tempGateway);
      } else {
        //tempGateway.measurements = getGatewayLastMeasurements(tempGateway);
        gatewaysTemp.push(tempGateway);
      }
    });
  }

  return [gatewaysTemp, pinnedGatewaysTemp];
}
