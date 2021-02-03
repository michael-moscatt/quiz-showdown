import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import TurnIndicator from './TurnIndicator';
import Box from '@material-ui/core/Box';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { SocketContext } from '../context/socket-context';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 250
  },
  full: {
    width: '100%',
    height: '100%'
  },
  turn: {
    marginTop: -30
  },
  title: {
    margin: theme.spacing(2)
  },
  score: {
    marginBottom: theme.spacing(2) 
  },
  button: {
    color: theme.palette.secondary.light
  }
}));

function ScoreCard(props) {
  const classes = useStyles();
  const socket = useContext(SocketContext);

  function changePoints(type){
    socket.emit('host-override', props.name, type);
  }

  const cardText = props.score < 0 ? `-$${props.score * -1}` : `$${props.score}`;

  const addButton =
    <Tooltip title="Give credit for last question">
      <IconButton className={classes.button} onClick={() => changePoints('add')}>
        <AddCircleIcon />
      </IconButton>
    </Tooltip>

  const subButton =
    <Tooltip title="Remove credit for last question">
      <IconButton className={classes.button} onClick={() => changePoints('sub')}>
        <RemoveCircleIcon />
      </IconButton>
    </Tooltip>

  return (
    <Box className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Box className={classes.turn} display="flex" justifyContent="center" >
            {props.turn && <TurnIndicator />}
          </Box>
        </Grid>
        <Grid className={classes.full} item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Box className={classes.title} display="flex" justifyContent="center">
                <Typography variant="h6">
                  {props.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className={classes.score} display="flex" justifyContent="space-around">

                {props.isHost && subButton}
                <Typography variant="h5">
                  {cardText}
                </Typography>
                {props.isHost && addButton}

              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
export default ScoreCard;