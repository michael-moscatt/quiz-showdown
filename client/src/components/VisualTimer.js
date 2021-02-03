import { makeStyles } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 800,
    height: 10,
    align: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  timer: {
    height: 10,
    width: fraction => `${fraction}%`,
    backgroundColor: theme.palette.primary.light,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  }
}));

function VisualTimer(props){
  const fraction = props.fraction < 1 ? 0 : props.fraction
  const classes = useStyles(fraction);

  const timer = 
    <Box className={classes.timer}>
    </Box>

  return (
    <Box className={classes.root}>
      {props.fraction ? timer : false}
    </Box>
  );
}
export default VisualTimer;