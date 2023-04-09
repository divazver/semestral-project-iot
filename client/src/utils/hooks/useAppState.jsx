import React, {useContext, createContext} from "react";
import useLocalStorage from "./useLocalStorage";
const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [pinnedGateways, setPinnedGateways] = useLocalStorage("pinned", []);

  return <AppContext.Provider value={{
    pinnedGateways,
    setPinnedGateways,
  }}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
