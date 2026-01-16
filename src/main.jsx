import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { WizardProvider } from "./app/state.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WizardProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </WizardProvider>
  </React.StrictMode>
);
