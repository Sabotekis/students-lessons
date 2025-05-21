export const msalConfig = {
  auth: {
    clientId: "secret",
    authority: "https://login.microsoftonline.com/common",
    // For local
    // redirectUri: "http://localhost:3000",
    // For Docker
    redirectUri: "http://localhost",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email", "offline_access", "User.Read", "Calendars.ReadWrite"]
};