import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FlashMessageContext = createContext();

export const FlashMessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const location = useLocation();

  const showMessage = (type, text, persist = false) => {
    const msg = { type, text };

    if (persist) {
      sessionStorage.setItem("flashMessage", JSON.stringify(msg));
    } else {
      setMessage(msg);
    }
  };

  const clearMessage = () => {
    setMessage(null);
    sessionStorage.removeItem("flashMessage");
  };

  // 🔄 On page load: check for persisted flash message
  useEffect(() => {
    console.log("in it");
    const stored = sessionStorage.getItem("flashMessage");
    if (stored) {
      setMessage(JSON.parse(stored));
      sessionStorage.removeItem("flashMessage");
    }
  }, [location]);

  return (
    <FlashMessageContext.Provider
      value={{ message, showMessage, clearMessage }}
    >
      {children}
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = () => useContext(FlashMessageContext);
