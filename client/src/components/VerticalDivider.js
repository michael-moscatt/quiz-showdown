import { makeStyles } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    paddingTop: theme.spacing(2), 
    paddingBottom: theme.spacing(2)
  },
  divider: {
    background: theme.palette.grey[400]
  }
}));

function VerticalDivider(){
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Divider className={classes.divider} orientation="vertical" flexItem />
    </Box>
  )
}

export default VerticalDivider;