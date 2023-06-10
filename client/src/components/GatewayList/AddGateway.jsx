import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useValidation } from '../../utils/hooks/useValidation';
import { isEmptyValue } from '../../utils/utils';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import FolderIcon from '@mui/icons-material/Folder';
import { createGateway as createGatewayClient } from '../../api/gateway/gateway';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';


const GatewayForm = ({ loading, setLoading, onSubmit, getGateways }) => {
  const [gatewayName, setGatewayName] = useState('');
  const [token, setToken] = useState('');
  const [newGateway, setNewGateway] = useState(false);
  const [open, setOpen] = React.useState(true);

  const { errors, setErrors, hasError, getError, removeError } = useValidation();
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    let tempErrors = {};

    if (isEmptyValue(gatewayName)) {
      tempErrors['gatewayName'] = 'This field can not be empty!';
    }

    if (Object.keys(tempErrors).length > 0) {
      tempErrors['global'] = 'Validation failed.';
      setErrors(tempErrors);
      setLoading(false);
    } else {
      onSubmit({ gatewayName });
    }
  };

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    if (hasError(name)) {
      removeError(name);
    }

    setGatewayName(value);
  };

  const createGateway = (name) =>
    createGatewayClient(name)
    .then((response) => {
      setToken(response?.data?.token)
      getGateways()
      setGatewayName('')
      setNewGateway(true)
      setOpen(true);
    })
    .catch((error) => console.log(error))


  return (
    <form noValidate onSubmit={handleSubmit}>
      {newGateway ? (
            <Stack sx={{ width: '100%' }} spacing={2}>
                    <Collapse in={open}>
            <Alert variant="outlined" severity="success" display="block"
            action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
              Gateway was successfully created. <br></br>
              Copy and save the API token for communication, it won't be accessible again. <br></br>
              TOKEN: {token}
            </Alert>
            </Collapse>
          </Stack>
      ): <></>}
      <ListItem
        key="add_new"
        secondaryAction={
          <IconButton edge="end" aria-label="add">
            <AddIcon onClick={() => createGateway(gatewayName)} />
          </IconButton>
        }>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon color="info" />
          </Avatar>
        </ListItemAvatar>
        <TextField
          placeholder="Insert a name"
          label="Add a new gateway"
          name="gatewayName"
          variant="standard"
          fullWidth
          required
          type="text"
          value={gatewayName}
          onChange={handleChange}
          error={hasError('gatewayName')}
          helperText={getError('gatewayName')}
          sx={{
            pb: 2,
          }}
        />
      </ListItem>
    </form>
  );
};

export default GatewayForm;
