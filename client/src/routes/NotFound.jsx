import React, {useEffect} from "react";
import useDocumentTitle from "../utils/hooks/useDocumentTitle";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Button, Container, Typography} from "@mui/material";
import LinkOffIcon from '@mui/icons-material/LinkOff';
import logo from "../resources/img/logo.png";

const NotFound = () => {
  const [, setPageTitle] = useDocumentTitle('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('Page has been not found');

    return () => setPageTitle('');
  }, [location]);

  return <Container sx={{ pt: 8, pb: 8 }}>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      mb: 15,
    }}>
      <img src={logo} style={{
        maxWidth: '100%',
        maxHeight: '60px',
      }}/>
      <LinkOffIcon sx={{fontSize: 120, mt: 15, mb: 2}} />
      <Typography variant={'h3'} sx={{mb: 2}}>The page has been not found!</Typography>
      <Typography variant={'body'}>The requested page has been not found. Please check the url or return back to the application.</Typography>
      <Button variant={'contained'} color={'primary'} onClick={() => navigate('/')} sx={{mt: 5}}>
        Return back to the application
      </Button>
    </Box>
    <Box sx={{ mt: 20 }}>
      &copy; 2023 parta <strong>hezkejch</strong> kluku.
    </Box>
  </Container>;
}

export default NotFound;
