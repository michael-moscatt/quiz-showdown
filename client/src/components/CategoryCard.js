import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 60,
    width: 230,
    borderRadius: '0px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: theme.spacing(1)
  }
}));


function CategoryCard(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      {props.name}
    </Paper>
  )
}
export default CategoryCard;