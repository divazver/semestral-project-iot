import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    common: {
      black: '#06070E',
    },
    primary: {
      main: '#0DC3FF',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f4e04d',
      contrastText: '#fff',
    },
    secondaryGreen: {
      main: '#476a6f',
      contrastText: '#fff',
    },
    grey: {
      //800: '#50514F',
      900: '#06070e',
    },
    greyLight: {
      main: '#757575',
    },
    text: {
      primary: '#06070e',
      secondary: '#9BAEBC',
    },
    background: {
      default: '#fff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#fff',
          color: '#06070e',
        },
      },
    },
  },
});
