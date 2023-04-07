import React, {useMemo} from "react";

import { Typography, IconButton, Avatar, Box, Menu, MenuItem, Divider } from '@mui/material';

import { useAuth } from 'utils/hooks/useAuth';

const LoggedUserInfo = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const userName = useMemo(() => `${user.firstName} ${user.lastName}`, [user]);
  const userIn = useMemo(() => user.firstName.charAt(0), [user]);
  const open = Boolean(anchorEl);

  const { logout } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Hello, {userName}</Typography>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 1 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}>
          <Avatar>{userIn}</Avatar>
        </IconButton>
      </Box>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem sx={{ display: { xs: 'block', md: 'none', opacity: '1!important' } }} disabled>
          Hello, {userName}
        </MenuItem>
        <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default LoggedUserInfo;
