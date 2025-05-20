import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "7ece545d-5747-4475-834d-848309eae818",
    authority: "https://login.microsoftonline.com/7048f03b-727f-42fa-a024-7e583092e86d",
    redirectUri: "http://localhost:3000/msal"
  }
};
const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId="277862014606-l3rh2c7driutrhesffl5chuo5tps0tab.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider> */}
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
reportWebVitals();
