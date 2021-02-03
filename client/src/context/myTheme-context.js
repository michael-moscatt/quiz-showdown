import { createMuiTheme } from "@material-ui/core/styles";

let myTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#3f51b5",
      ultraLight: "#dadef1",
    }
  }
});

myTheme.palette.background.default = myTheme.palette.grey[100];

// Set a sizing for categories
// myTheme.typography.h6 = {
//   fontSize: '0.8rem',
//   [myTheme.breakpoints.up('md')]: {
//     fontSize: '1.0rem',
//   },
//   [myTheme.breakpoints.up('lg')]: {
//     fontSize: '1.2rem',
//   },
// };

export default myTheme;