import React from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Login from "./routes/Login";
import GuestRoute from "./routes/GuestRoute";
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box } from '@mui/material';
import {useRoutes} from "react-router-dom";
import SignUp from "./routes/Signup";
import AuthRoute from "./routes/AuthRoute";
import Dashboard from "./routes/Dashboard";
import {useAuth} from "./utils/hooks/useAuth";
import Page from "./Components/Page/Page";

const routesMap = [
  {
    title: 'GuestRoutes',
    element: <GuestRoute/>,
    children: [
      {
        title: 'Login',
        path: '/',
        key: 'login',
        element: <Login/>,
      },
      {
        title: 'SignUp',
        path: '/signup',
        key: 'signup',
        element: <SignUp/>,
      },
    ],
  },
  {
    title: 'Page',
    key: 'page',
    element: <Page/>,
    children: [
      {
        title: 'AuthRoutes',
        element: <AuthRoute/>,
        children: [
          {
            title: 'Dashboard',
            path: '/dashboard',
            key: 'dashboard',
            element: <Dashboard/>,
          },
        ],
      },
    ],
  },
]

function App() {
  const routes = useRoutes(routesMap);
  const { initializing } = useAuth();

  return initializing ? (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <CircularProgress size={150} />
    </Box>
  ) : (<>
    <CssBaseline/>
    <div className="App">
      {routes}
    </div>
  </>);
}

export default App;
