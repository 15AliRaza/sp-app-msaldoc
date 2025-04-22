import React, { useState, useEffect } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);
// await msalInstance.initialize();

// Optional - This will update account state if a user signs in from another tab or window
/*msalInstance.addEventCallback((event) => {
  if (
    event.eventType === EventType.LOGIN_SUCCESS ||
    event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
  ) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});*/

export const AuthProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // MSAL initialization
    msalInstance
      .initialize()
      .then(() => {
        // Optional: Handle redirect response if using redirect flow
        msalInstance
          .handleRedirectPromise()
          .then(() => {
            setInitialized(true);
          })
          .catch(() => {
            setInitialized(true);
          });
      })
      .catch(() => {
        setInitialized(true);
      });

    // Event callback for account changes
    const callbackId = msalInstance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ) {
        msalInstance.setActiveAccount(event.payload.account);
      }
    });

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId);
      }
    };
  }, []);

  if (!initialized) {
    return <div>Initializing authentication...</div>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};
