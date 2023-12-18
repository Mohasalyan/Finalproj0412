import { createTheme } from "@mui/material/styles";
import "@fontsource/montserrat"; // Import this line in a global stylesheet

const theme = createTheme({
  palette: {
    primary: {
      main: "#16db65",
      darken: "#081c15",
      lighten: "#9ef01a",
    },
    gray: {
      default: "#e5e5e5",
    },
    background: {
      default: "#fff",
      alt: "#F5F5F5",
      dark: "#2A3650",
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: 16,
  },
  spacing: 4,
  direction: "ltr",
});

export default theme;
