import React, {useEffect} from "react";
import { Alert } from '@mui/material';
import {useOutletContext} from "react-router-dom";

const Dashboard = () => {
  const [, setPageTitle] = useOutletContext();

  useEffect(() => setPageTitle('Dashboard'), []);

  return <Alert>You are logged in!</Alert>
};

export default Dashboard;
