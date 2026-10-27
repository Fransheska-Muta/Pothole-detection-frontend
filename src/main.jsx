import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import "./styling/theme.css"; // global road theme - keep last so it can refine the page styles

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <App />
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
