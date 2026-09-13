import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7016A3",
    },
    secondary: {
      main: "#5D1578",
    },
    success: {
      main: "#08AA4B",
    },
    warning: {
      main: "#FFC94F",
    },
    error: {
      main: "#DC2626",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme