export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URL,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [process.env.REACT_APP_SCOPES],
};

// export const sharepointApiConfig = {
//   endpoint: "https://graph.microsoft.com/v1.0/sites/YOUR_SHAREPOINT_SITE_ID", // Replace with your SharePoint site ID
//   scopes: ["https://graph.microsoft.com/.default"],
// };
