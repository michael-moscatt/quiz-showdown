import { createMuiTheme } from "@material-ui/core/styles";

let myTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#4570a1",
      lighter: "#b8cbe0",
      lightest: "#dbe5f0",
      contrastText: "#f4f7fa"
    },
    secondary: {
      main: "#4570a1"
    }
  }
});

myTheme.palette.background.default = myTheme.palette.grey[200];

export default myTheme;