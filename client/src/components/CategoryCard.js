import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 80,
    width: '100%',
    borderRadius: '0px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: theme.spacing(3)
  }
}));


function CategoryCard(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root} key={props.name}>
      {props.name}
    </Paper>
  )
}
export default CategoryCard;