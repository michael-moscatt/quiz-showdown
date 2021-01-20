import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    borderRadius: '0px',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: (props) =>
      props.value && props.active ? "pointer" : "default",
    background: (props) => props.status === 'unselected' ? theme.palette.common.white :
      theme.palette.grey[400]
  }
}));

function ValueCard(props) {
  const classes = useStyles(props);

  function handleClick() {
    if(props.value && props.active){
      props.onClick(props.index);
    }
  }

  var text = '';
  if(props.value){
    if(props.status === 'double'){
      text = 'Daily Double';
    } else{
      text = '$' + props.value;
    }
  }

  return (
    <Paper className={classes.root} onClick={handleClick}>
      {text}
    </Paper>
  );
}
export default ValueCard;