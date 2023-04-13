import React from "react";
import {IconButton, Tooltip} from "@mui/material";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import {isGatewayPinned, unpinGateway, pinGateway} from "utils/gateways";
import {useApp} from "../../utils/hooks/useAppState";

const GatewayPinButton = ({gatewayId}) => {
  const {pinnedGateways, setPinnedGateways} = useApp();

  return <Tooltip title={isGatewayPinned(gatewayId, pinnedGateways) ? "Remove from favorites" : "Mark as favorite"}>
    <IconButton onClick={() => setPinnedGateways(isGatewayPinned(gatewayId, pinnedGateways)
      ? unpinGateway(gatewayId, pinnedGateways)
      : pinGateway(gatewayId, pinnedGateways))}>
      {isGatewayPinned(gatewayId, pinnedGateways) ? <StarIcon/> : <StarBorderIcon/>}
    </IconButton>
  </Tooltip>;
}

export default GatewayPinButton;

