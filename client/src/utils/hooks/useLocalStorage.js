import React, {useEffect, useState} from "react";

const useLocalStorage = (key, defaultValue = undefined) => {

  const storedValue = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : defaultValue;
  const [value, setValue] = useState(storedValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, storedValue]);

  return [value, setValue];
}

export default useLocalStorage;
