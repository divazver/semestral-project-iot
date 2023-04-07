import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ThemeProvider} from '@mui/material/styles';
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./utils/hooks/useAuth";

import theme from 'theme';
import {ValidationProvider} from "./utils/hooks/useValidation";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ValidationProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
          <App/>
          </ThemeProvider>
        </AuthProvider>
      </ValidationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();