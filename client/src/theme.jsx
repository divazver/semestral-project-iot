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
      main: '#EB9929',
      contrastText: '#fff',
    },
    grey: {
      800: '#50514F',
    },
    text: {
      primary: '#50514F',
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
          color: '#374955',
        },
      },
    },
  },
});
