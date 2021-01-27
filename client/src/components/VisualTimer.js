import { makeStyles } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 20,
    align: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: theme.spacing(5), 
    paddingRight: theme.spacing(5)
  },
  timer: {
    height: 7,
    width: props => `${props.fraction}%`,
    backgroundColor: theme.palette.primary.main
  }
}));

function VisualTimer(props){
  const classes = useStyles(props);

  const timer = 
    <Paper className={classes.timer}>
   </Paper>

  return (
    <Box className={classes.root}>
      {!props.fraction ? <hr></hr> : timer}
    </Box>
  );
}
export default VisualTimer;