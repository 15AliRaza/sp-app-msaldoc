import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appData, setAppData] = useState([]);

  const updateAppData = (newData) => {
    setAppData((prev) => ({ ...prev, ...newData }));
    console.log(newData);
  };

  return (
    <AppContext.Provider value={{ appData, updateAppData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
