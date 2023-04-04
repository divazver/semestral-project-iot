import React from "react";
import {Navigate, Outlet} from "react-router-dom";

import { useAuth } from 'utils/hooks/useAuth';

const AuthRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AuthRoute;
