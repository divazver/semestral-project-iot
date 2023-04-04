import React, {useState, useEffect, useContext, createContext} from "react";
const ValidationContext = createContext();

export const ValidationProvider = ({ children }) => {
  const [errors, setErrors] = useState({});

  const hasError = (field) => !!errors[field];

  const getError = (field) => hasError(field) ? errors[field] : "";

  const setError = (field, error) => {
    let tempErrors = {...errors};
    tempErrors[field] = error;
    setErrors(tempErrors);
  }

  const removeError = (field) => {
    let tempErrors = {...errors};
    delete tempErrors[field];
    setErrors(tempErrors);
  }

  useEffect(() => {
    console.log(errors);
  }, [errors])


  return <ValidationContext.Provider value={{
    errors,
    setErrors,
    hasError,
    getError,
    setError,
    removeError,
  }}>{children}</ValidationContext.Provider>;
}

export const useValidation = () => useContext(ValidationContext);
