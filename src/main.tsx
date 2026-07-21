import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PathsProvider } from "@/context/PathsContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PathsProvider>
      <App />
    </PathsProvider>
  </React.StrictMode>
);
