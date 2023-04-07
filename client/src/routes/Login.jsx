import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from 'react-router-dom';
import {Typography, Divider, TextField, Button, Alert} from '@mui/material';
import {useAuth} from "../utils/hooks/useAuth";
import {isEmptyValue, isValidEmail} from "../utils/utils";

const Login = () => {
  const [{email, password}, setCredentials] = useState({email: "", password: ""});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [, setPageTitle] = useOutletContext();

  const {login} = useAuth();
  const navigate = useNavigate();

  const hasError = (field) => !!errors[field];

  const getError = (field) => hasError(field) ? errors[field] : "";

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    let tempCredentials = {email, password};
    tempCredentials[name] = value;

    if (hasError(name)) {
      let tempErrors = {...errors};
      delete tempErrors[name];
      setErrors(tempErrors)
    }

    setCredentials(tempCredentials);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let errors = {};

    if (isEmptyValue(email)) {
      errors['email'] = "This field can not be empty!";
    }

    if (isEmptyValue(password)) {
      errors['password'] = "This field can not be empty!";
    }

    if (!errors['email'] && !isValidEmail(email)) {
      errors['email'] = "Invalid email!";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setLoading(false);
    } else {
      login(email, password)
        .then((response) => {
          navigate('/dashboard');
        })
        .catch((error) => {
          setErrors({
            global: "Invalid Credentials!",
            email: "Possible invalid value.",
            password: "Possible invalid value.",
          })
        })
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => setPageTitle('Account'), []);

  return <>
    {hasError("global") && <Alert severity="error" sx={{mb: 5}}>{getError("global")}</Alert>}
    <Typography variant={'h5'}>{`WetApp Account`}</Typography>
    <Typography variant={'body1'} sx={{pb: 2}}>{`SignIn and explore past data about weather.`}</Typography>

    <form noValidate onSubmit={handleSubmit}>
      <TextField
        placeholder="Enter your email"
        label="Email"
        name="email"
        variant="outlined"
        fullWidth
        required
        type="email"
        value={email}
        onChange={handleChange}
        error={hasError("email")}
        helperText={getError("email")}
        sx={{
          pb: 2,
        }}
      />

      <TextField
        placeholder="Enter your password"
        label="Password"
        name="password"
        variant="outlined"
        fullWidth
        required
        type="password"
        value={password}
        onChange={handleChange}
        error={hasError("password")}
        helperText={getError("password")}
        sx={{
          pb: 3,
        }}
      />
      <Button type="submit" disabled={loading} variant="contained" color="primary" sx={{mr: 1, width: '100%'}}>
        Sign In
      </Button>
      <Divider color="text.disabled" sx={{my: 5}}>OR</Divider>
      <Button disabled={loading} variant="outlined" color="primary" sx={{ml: 1, width: '100%'}} onClick={() => navigate("signup")}>
        Sign Up
      </Button>
    </form>
  </>;
}

export default Login;
