import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";
import clsx from  'clsx';

const useStyles = makeStyles((theme) => ({
  sizing: {
    height: 50,
    width: 100,
  },
  selected: {
    borderColor: (props) =>  props.status === 'selected' ? theme.palette.primary.dark : false,
    background: (props) => props.status === 'selected' ? theme.palette.primary.ultraLight : false
  }
}));

function ValueCard(props) {
  const classes = useStyles(props);

  function handleClick() {
    if(props.value && props.active){
      props.click(props.index);
    }
  }

  const button = 
    <Button className={clsx(classes.sizing, classes.selected)} variant="outlined" color="primary" 
      onClick={handleClick}>
      <Typography variant="h5">
        {'$' + props.value}
      </Typography>
    </Button>

  const missing =
    <Box className={classes.sizing}>
    </Box>

  return (
    props.value ? button : missing
  );
}
export default ValueCard;