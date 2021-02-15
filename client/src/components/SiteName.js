import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main
  },
  text: {
    color: theme.palette.primary.lightest
  },
  flair: {
    color: theme.palette.primary.contrastText,
    fontStyle: 'italic'
  }
}));

function SiteName() {
  const classes = useStyles();

  return (
    <Box className={classes.root} p={2} mb={2}>
      <Typography className={classes.text} variant="h5">
        Quiz<span className={classes.flair}>Showdown</span>
      </Typography>
    </Box>
  );
}
export default SiteName;