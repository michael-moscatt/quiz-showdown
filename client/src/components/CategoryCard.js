import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import { Typography } from "@material-ui/core";

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
    paddingLeft: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderTopLeftRadius: (props) => props.borders.includes('left') ? theme.shape.borderRadius : 0,
    borderTopRightRadius: (props) => props.borders.includes('right') ? theme.shape.borderRadius : 0,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: theme.palette.grey[900]
  }
}));


function CategoryCard(props) {
  const classes = useStyles(props);

  return (
    <Paper className={classes.root} key={props.name}>
      <Typography variant="h6">
        {props.name}
      </Typography>
    </Paper>
  )
}
export default CategoryCard;