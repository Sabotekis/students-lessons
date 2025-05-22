export const msalConfig = {
  auth: {
    clientId: "7ece545d-5747-4475-834d-848309eae818",
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