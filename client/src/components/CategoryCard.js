import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    borderRadius: '0px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2)
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