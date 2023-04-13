import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ThemeProvider} from '@mui/material/styles';
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./utils/hooks/useAuth";

import theme from 'theme';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {ValidationProvider} from "./utils/hooks/useValidation";
import {AppContextProvider} from "./utils/hooks/useAppState";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ValidationProvider>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <AppContextProvider>
                <App/>
              </AppContextProvider>
            </ThemeProvider>
          </AuthProvider>
        </ValidationProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
