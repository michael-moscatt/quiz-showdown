import { makeStyles } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 50,
    height: 50,
    align: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(1)
  }
}));

function DigitalTimer(props){
  const classes = useStyles();

  const time = props.time < 0 ? '0.0' : (props.time / 1000).toFixed(1);
  return (
    <Box className={classes.root}>
      <Typography variant="h6">
        {time}
      </Typography>
    </Box>
  );
}
export default DigitalTimer;