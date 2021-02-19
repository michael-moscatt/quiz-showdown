import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main
  },
  text: {
    color: theme.palette.primary.contrastText
  },
  flair: {
    fontStyle: 'italic'
  },
  link: {
   cursor: "pointer"
  }
}));

function SiteName() {
  const classes = useStyles();

  function mainMenu(){
    window.location.reload();
  }

  return (
    <Box className={classes.root} p={2} mb={2}>
      <Typography className={classes.text} variant="h5" >
        <span className={classes.link} onClick={mainMenu}>Quiz<span className={classes.flair}>Showdown</span></span>
      </Typography>
    </Box>
  );
}
export default SiteName;