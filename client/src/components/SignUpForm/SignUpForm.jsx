import React, {useState, useEffect} from "react";
import {Button, Divider, TextField} from "@mui/material";
import {useValidation} from "../../utils/hooks/useValidation";
import {isEmptyValue, isValidEmail} from "../../utils/utils";

const SignUpForm = ({loading, setLoading, onSubmit}) => {

  const [{firstName, lastName, email, roleID, password}, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const {errors, setErrors, hasError, getError, removeError} = useValidation();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    let tempErrors = {};

    if (isEmptyValue(firstName)) {
      tempErrors['firstName'] = "This field can not be empty!";
    }

    if (isEmptyValue(lastName)) {
      tempErrors['lastName'] = "This field can not be empty!";
    }

    if (isEmptyValue(email)) {
      tempErrors['email'] = "This field can not be empty!";
    }

    if (isEmptyValue(password)) {
      tempErrors['password'] = "This field can not be empty!";
    }

    if (isEmptyValue(repeatedPassword)) {
      tempErrors['repeatedPassword'] = "This field can not be empty!";
    }

    if (!tempErrors['email'] && !isValidEmail(email)) {
      tempErrors['email'] = "Invalid email!";
    }

    if ((!tempErrors['password'] && !tempErrors['repeatedPassword']) && password !== repeatedPassword) {
      tempErrors['password'] = "Passwords did not match!";
      tempErrors['repeatedPassword'] = "Passwords did not match!";
    }

    if (Object.keys(tempErrors).length > 0) {
      tempErrors["global"] = "Validation failed."
      setErrors(tempErrors);
      setLoading(false);
    } else {
      onSubmit({firstName, lastName, email, roleID, password});
    }
  }

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    let tempUser = {firstName, lastName, email, roleID, password};
    tempUser[name] = value;

    if (hasError(name)) {
      removeError(name);
    }

    setUser(tempUser);
  }

  return <form noValidate onSubmit={handleSubmit}>
    <TextField
      placeholder="First name"
      label="First name"
      name="firstName"
      variant="outlined"
      fullWidth
      required
      type="text"
      value={firstName}
      onChange={handleChange}
      error={hasError("firstName")}
      helperText={getError("firstName")}
      sx={{
        pb: 2,
      }}
    />
    <TextField
      placeholder="Last name"
      label="Last name"
      name="lastName"
      variant="outlined"
      fullWidth
      required
      type="text"
      value={lastName}
      onChange={handleChange}
      error={hasError("lastName")}
      helperText={getError("lastName")}
      sx={{
        pb: 2,
      }}
    />
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
    />
    <Divider color="text.disabled" sx={{my: 3}}>PASSWORD</Divider>
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
    <TextField
      placeholder="Repeat your password"
      label="Repeat password"
      name="repeatedPassword"
      variant="outlined"
      fullWidth
      required
      type="password"
      value={repeatedPassword}
      onChange={(e) => setRepeatedPassword(e.target.value)}
      error={hasError("repeatedPassword")}
      helperText={getError("repeatedPassword")}
      sx={{
        pb: 3,
      }}
    />
    <Button type="submit" disabled={loading} variant="contained" color="primary" sx={{mr: 1, width: '100%'}}>
      Sign Up
    </Button>
  </form>;
}

export default SignUpForm;
