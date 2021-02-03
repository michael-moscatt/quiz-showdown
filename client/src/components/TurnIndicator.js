import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 100,
    height: 30,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius
  }
  }));

function TurnIndacator(){
    const classes= useStyles();

    return (
        <div className={classes.root}>Turn</div>
    )
}
export default TurnIndacator;