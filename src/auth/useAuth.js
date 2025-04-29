import { useState, useEffect, useContext } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export const useAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inProgress === "none") {
      // const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        setIsAuthenticated(true);
        setUserProfile(accounts[0]);
        console.log(accounts[0]);

        // Get token silently
        instance
          .acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          })
          .then((response) => {
            setToken(response.accessToken);
          })
          .catch((error) => {
            console.error("Token acquisition failed", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        instance.loginPopup(loginRequest).catch((error) => {
          console.error("Login failed", error);
          setIsLoading(false);
        });
        console.log("reset");
        /*setIsAuthenticated(false);
        setUserProfile(null);
        setToken(null);
        setIsLoading(false);*/
        /*instance
          .ssoSilent(loginRequest)
          .then((response) => {
            instance.setActiveAccount(response.account);
            setIsAuthenticated(true);
            setUserProfile(response.account);
            setToken(response.accessToken);
          })
          .catch((error) => {
            console.log("Silent login failed", error);
            setIsAuthenticated(false);
            setUserProfile(null);
            setToken(null);
          })
          .finally(() => {
            setIsLoading(false);
          });*/
      }
    }
  }, [accounts, instance, inProgress]);

  const login = async () => {
    setIsLoading(true);
    try {
      // Try silent login first if possible
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        setToken(response.accessToken);
        setUserProfile(accounts[0]);
        setIsAuthenticated(true);
      } else {
        // Fallback to popup
        await instance.loginPopup(loginRequest);
      }
    } catch (error) {
      console.error("Login failed", error);
      // Try popup if silent fails
      await instance.loginPopup(loginRequest);
    } finally {
      setIsLoading(false);
    }
  };

  /*const login = () => {
    setIsLoading(true);
    instance.loginPopup(loginRequest).catch((error) => {
      console.error("Login failed", error);
      setIsLoading(false);
    });
  };*/

  const logout = () => {
    setIsLoading(true);
    instance.logoutPopup().finally(() => setIsLoading(false));
  };
  console.log("User", userProfile);

  return { isAuthenticated, userProfile, token, isLoading, login, logout };
};
