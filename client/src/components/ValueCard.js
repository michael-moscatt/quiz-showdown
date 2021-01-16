import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 60,
    width: 230,
    borderRadius: '0px',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: (props) =>
      props.value && props.active ? "pointer" : "default"
  }
}));

function ValueCard(props) {
  const classes = useStyles(props);

  function handleClick() {
    if(props.value && props.active){
      props.onClick(props.index);
    }
  }

  return (
    <Paper className={classes.root} onClick={handleClick}>
      {props.value ? '$' + props.value : ''}
    </Paper>
  );
}
export default ValueCard;