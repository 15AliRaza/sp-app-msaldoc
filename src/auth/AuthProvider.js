import React, { useState, useEffect } from "react";
import { MsalProvider } from "@azure/msal-react";
import {
  PublicClientApplication,
  EventType,
  InteractionType,
} from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await msalInstance.initialize();

      try {
        // Handle the redirect response
        const response = await msalInstance.handleRedirectPromise();

        if (response) {
          msalInstance.setActiveAccount(response.account);

          // Get the stored pre-auth URL or use root
          const redirectUrl = sessionStorage.getItem("preAuthUrl") || "/";
          sessionStorage.removeItem("preAuthUrl");

          // Only navigate if we're on the login page
          if (window.location.pathname === "/login") {
            console.log("--------------", redirectUrl);
            //window.location.href = redirectUrl; // Full page reload to break cycle
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();

    // Event listener for account changes
    const callbackId = msalInstance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ) {
        msalInstance.setActiveAccount(event.payload.account);
      }
    });

    return () => {
      if (callbackId) msalInstance.removeEventCallback(callbackId);
    };
  }, []);

  /*useEffect(() => {
    const initializeAuth = async () => {
      try {
        await msalInstance.initialize();

        // 1. Check for redirect response (if coming back from login)
        const redirectResponse = await msalInstance.handleRedirectPromise();
        if (redirectResponse) {
          msalInstance.setActiveAccount(redirectResponse.account);
          setInitialized(true);
          return;
        }

        // 2. Check for existing accounts silently
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          try {
            // Attempt silent token acquisition
            const silentResponse = await msalInstance.acquireTokenSilent({
              ...loginRequest,
              account: accounts[0],
            });
            msalInstance.setActiveAccount(silentResponse.account);
          } catch (silentError) {
            // If silent fails, try interactive login via popup
            await msalInstance.loginPopup(loginRequest);
          }
        }

        setInitialized(true);
      } catch (error) {
        console.error("Authentication initialization failed:", error);
        setInitialized(true);
      }
    };

    initializeAuth();

    // Event listener for account changes
    const callbackId = msalInstance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ) {
        msalInstance.setActiveAccount(event.payload.account);
      }
    });

    return () => {
      if (callbackId) msalInstance.removeEventCallback(callbackId);
    };
  }, []);*/

  if (!initialized) {
    return <div>Loading authentication state...</div>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};
