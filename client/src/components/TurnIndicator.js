import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 100,
    height: 30,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px 10px 0px 0px"
  }
  }));

function TurnIndacator(){
    const classes= useStyles();

    return (
        <div className={classes.root}>Turn</div>
    )
}
export default TurnIndacator;