import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserContextProvider } from "./context/UserContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

// export const server = "http://localhost:5000";
export const server = "https://convoai-deploy.onrender.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <ChatProvider>
        <App /> 
      </ChatProvider>
    </UserContextProvider>
  </React.StrictMode>
);
