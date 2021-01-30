import { createMuiTheme } from "@material-ui/core/styles";

let myTheme = createMuiTheme();

myTheme.palette.background.default = myTheme.palette.grey[100];

// Set a sizing for categories
myTheme.typography.h6 = {
  fontWeight: 400,
  fontSize: '0.8rem',
  [myTheme.breakpoints.up('md')]: {
    fontSize: '1.0rem',
  },
  [myTheme.breakpoints.up('lg')]: {
    fontSize: '1.2rem',
  },
};

export default myTheme;