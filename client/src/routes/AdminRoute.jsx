import React, {useEffect} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";

import { useAuth } from 'utils/hooks/useAuth';
import useDocumentTitle from "../utils/hooks/useDocumentTitle";

const AuthRoute = () => {
  const { isAdmin } = useAuth();
  const [pageTitle, setPageTitle] = useDocumentTitle('');
  const location = useLocation();

  useEffect(() => () => setPageTitle(''), [location]);

  if (!isAdmin) {
    // user is not authenticated
    return <Navigate to="/" />;
  }

  return <Outlet context={[pageTitle, setPageTitle]}/>;
};

export default AuthRoute;
