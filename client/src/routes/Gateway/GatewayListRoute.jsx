import React, { useEffect, useState } from 'react';
import { deleteGateway as deleteGatewayClient, getGateway } from '../../api/gateway/gateway';
import Loader from 'components/Loader/Loader';
import GatewayNotFound from 'components/GatewayNotFound/GatewayNotFound';
import { getAllGateways } from '../../api/gateway/gateway';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import GatewayForm from 'components/GatewayList/AddGateway';


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const GatewaylistRoute = () => {
  const [loading, setLoading] = useState(true);
  const [gateways, setGateways] = useState(undefined);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  const getGateways = () =>
    getAllGateways()
      .then((response) => {
        if (response?.data) {
          let gateways = response?.data.map((gateway) => {
            gateway.loaded = false;

            return gateway;
          });

          setGateways(gateways);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));


  const deleteGateway = (id) =>
      deleteGatewayClient(id)
      .then((response) => {
        getGateways();
      })
      .catch((error) => console.log(error))

  useEffect(() => {
    getGateways();
  }, []);

  return loading ? (
    <Loader message={'Loading gateways'} />
  ) : (
    <>
      {gateways ? (
        <>
          <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              All Available Gateways
            </Typography>
            <Demo>
              <List dense={dense}>
                {gateways?.map((element) => (
                  <>
                    <ListItem
                      key={element.name}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" key={element?._id} onClick={() => deleteGateway(element?._id)}>
                          <DeleteIcon/>
                        </IconButton>
                      }>
                      <ListItemAvatar >
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={element?.name} secondary={secondary ? 'Secondary text' : null} />
                    </ListItem>
                  </>
                ))}
                  <GatewayForm getGateways={getGateways}></GatewayForm>
              </List>
            </Demo>
          </Grid>
        </>
      ) : (
        <GatewayNotFound />
      )}
    </>
  );
};
export default GatewaylistRoute;
