import React, {useEffect, useState} from "react";
import {useOutletContext} from 'react-router-dom';
import {Alert, Typography} from "@mui/material";
import SignUpForm from "../components/SignUpForm/SignUpForm";
import {registerUser} from "../api/user/user";
import {useValidation} from "../utils/hooks/useValidation";
import {useAuth} from "../utils/hooks/useAuth";

const SignUp = () => {

  const [loading, setLoading] = useState();
  const {setErrors, hasError, setError, getError} = useValidation();
  const {authByToken} = useAuth();
  const [, setPageTitle] = useOutletContext();

  const handleSubmit = (user) => {
    registerUser(user)
      .then((response) => {
        if(response?.data?.token){
          authByToken(response?.data?.token);
        }
      })
      .catch((e) => {
        if(e?.response?.data?.message) {
          setErrors({global: e.response.data.message})
        } else if (Array.isArray(e?.response?.data)) {
          let remapErrors = e.response.data.map((item) => [item?.field, item?.message]);
          let validationErrors = Object.fromEntries(remapErrors);
          validationErrors["global"] = "Validation failed."
          setErrors(validationErrors);
        } else {
          setError("global", "Something wrong occurred!")
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => setPageTitle('Sign up'), [])

  return <>
    {hasError("global") && <Alert severity="error" sx={{mb: 5}}>{getError("global")}</Alert>}
    <Typography variant={'h5'}>{`WetApp Signup`}</Typography>
    <Typography variant={'body1'} sx={{pb: 2}}>{`Get a window into the past.`}</Typography>

    <SignUpForm loading={loading} setLoading={setLoading} onSubmit={handleSubmit}/>
  </>
}

export default SignUp;
