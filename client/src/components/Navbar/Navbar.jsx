import React from "react";
import {useNavigate} from "react-router-dom";

import {
  AppBar,
  Box,
  Drawer,
  Divider,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link,
  Toolbar,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';

import logo from 'resources/img/logo.png';
import {useAuth} from 'utils/hooks/useAuth';
import LoggedUserInfo from '../LoggedUserInfo/LoggedUserInfo';

const Navbar = ({navItems}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const {authenticated, user, isAdmin} = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: {xs: 1, sm: 0},
          height: 56,
        }}>
        <img
          src={logo}
          alt="WetApp!"
          style={{
            maxWidth: 125,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        />
      </Box>

      <Divider/>

      <List>
        {navItems.map(({name, path}) => (
          <ListItem key={name} disablePadding>
            <ListItemButton sx={{textAlign: 'center'}} onClick={() => navigate(path)}>
              <ListItemText primary={name}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{display: 'flex'}}>
      <AppBar component="nav" position="relative" sx={{boxShadow: 0, borderBottom: 1, borderColor: 'grey.200'}}>
        <Container>
          <Toolbar disableGutters={true}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{display: {sm: 'none'}, ml: 1, mr: 2}}>
              <MenuIcon/>
            </IconButton>

            <Box sx={{display: 'flex', flexGrow: {xs: 1, sm: 0}}}>
              <img
                src={logo}
                alt="WetApp!"
                style={{
                  maxWidth: 125,
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/')}
              />
            </Box>

            <Box sx={{flexGrow: 1, pl: 3, display: {xs: 'none', sm: 'block'}}}>
              {navItems.map(({name, path, logged}) => {
                if (user) {
                  return (
                    <Link
                      key={name}
                      color={'text.primary'}
                      sx={{cursor: 'pointer', ml: 2, fontWeight: 2, typography: 'subtitle2'}}
                      onClick={() => navigate(path)}
                      underline={'none'}>
                      {name}
                    </Link>
                  );
                } else if (user === null && !logged) {
                  return (
                    <Link
                      key={name}
                      color={'text.primary'}
                      sx={{cursor: 'pointer', ml: 2, fontWeight: 2, typography: 'subtitle2'}}
                      onClick={() => navigate(path)}
                      underline={'none'}>
                      {name}
                    </Link>
                  );
                }
              })}
              {isAdmin &&
                    <Link
                    key='gateways'
                    color={'text.primary'}
                    sx={{cursor: 'pointer', ml: 2, fontWeight: 2, typography: 'subtitle2'}}
                    onClick={() => navigate('/gateways')}
                    underline={'none'}>
                    Gateways
                  </Link>}
            </Box>

            {authenticated ? (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <LoggedUserInfo user={user}/>
              </Box>
            ) : ""}
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          container={window !== undefined ? () => window.document.body : undefined}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: {xs: 'block', sm: 'none'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: 240},
          }}>
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Navbar;
