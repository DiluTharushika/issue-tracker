import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* AuthProvider makes token available to entire app */}
    <AuthProvider>
      {/* BrowserRouter enables route-based pages */}
      <BrowserRouter>
        <ThemeProvider>
        <App />
      </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);