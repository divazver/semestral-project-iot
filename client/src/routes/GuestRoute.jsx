import React, {useEffect} from "react";
import {Outlet, Navigate, useLocation} from "react-router-dom";

import {useAuth} from 'utils/hooks/useAuth';
import {Box, Grid, Typography} from "@mui/material";
import promoImage from "../resources/img/promo-image.jpg";
import logo from "../resources/img/logo-white.png";
import useDocumentTitle from "../utils/hooks/useDocumentTitle";

const GuestRoute = () => {
  const slogan = "Statistics about";
  const sloganSecondLine = "weather in your city.";
  const [pageTitle, setPageTitle] = useDocumentTitle('');
  const location = useLocation();

  const {user} = useAuth();

  useEffect(() => () => setPageTitle(''), [location]);

  if (user) {
    return <Navigate to={"/dashboard"}/>;
  }

  return <Grid container sx={{height: '100vh'}}>
    <Grid item xs={12} sm={5} md={4} lg={4} sx={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: {
        sm: 'center',
      },
      color: (theme) => theme.palette.common.white,
      backgroundImage: `url(${promoImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        px: {
          xs: 5,
          sm: 3,
        },
        py: {
          xs: 5,
        },
      }}>
        <Box sx={{
          content: true,
          display: 'block',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: 'linear-gradient(to bottom, rgba(255,0,0,0) , rgb(71, 106, 111) 100%)',
        }}/>
        <Box sx={{
          position: 'relative',
          zIndex: 1,
        }}>
          <Box>
            <img src={logo} style={{
              maxWidth: '100%',
            }}/>
          </Box>
          <Box sx={{
            pt: 5,
          }}>
            <Typography variant={'h3'}>{slogan}<br/>{sloganSecondLine}</Typography>
          </Box>
        </Box>
        <Box sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 5,
          textAlign: 'center',
        }}>
          &copy; 2023 Parta <strong>hezkejch</strong> kluku.
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12} sm={7} md={8} lg={8}>
      <Grid container
            alignItems="center"
            sx={{
              height: {
                sm: '100vh',
              },
              p: {
                xs: 5,
                sm: 0,
              },
              pl: {
                sm: 3,
                md: 15,
              },
            }}
      >
        <Grid item xs={12} sm={10} md={7} lg={6} xl={5}>
          <Outlet context={[pageTitle, setPageTitle]}/>
        </Grid>
      </Grid>
    </Grid>
  </Grid>;
}

export default GuestRoute;
