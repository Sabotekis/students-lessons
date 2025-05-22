import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n'; 
import App from './App';
import reportWebVitals from './reportWebVitals';

import { GoogleOAuthProvider } from '@react-oauth/google';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./msalConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="277862014606-l3rh2c7driutrhesffl5chuo5tps0tab.apps.googleusercontent.com">
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
reportWebVitals();
