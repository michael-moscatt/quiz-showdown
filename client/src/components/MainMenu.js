import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../context/socket-context';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import JoinDialog from './JoinDialog.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3)
  },
  menuItem: {
    minWidth: 200,
    margin: theme.spacing(.5)
  }
}));

function MainMenu(){
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const [username, setUsername] = useState('');
  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  function handleJoinDialogOpen() {
    setJoinDialogOpen(true);
  }
  function handleJoinDialogClose() {
    setJoinDialogOpen(false);
  }

  function handleHostClick() {
    socket.emit('host', username);
  }

  function setEventListeners() {
    socket.on('join-error',
      (error) => {
        // todo: Inform user error has occured
        console.log(error);
    });
    return function removeEventListeners() {
      socket.off('join-error');
    }
  }
  useEffect(setEventListeners, [socket]);

  return (
    <Box display="flex" justifyContent="center" mt={3}>
      <Paper className={classes.paper} elevation={3}>
        <Box display="flex" justifyContent="center" flexDirection="column">
          <TextField className={classes.menuItem} id="username" label="Name" variant="filled"
            margin="dense" autoComplete="off" onChange={handleUsernameChange}
            inputProps={{ maxLength: 16 }} />
          <Button className={classes.menuItem} size="large" color="primary" variant="contained"
            onClick={handleHostClick}>
            Host
          </Button>
          <Button className={classes.menuItem} size="large" color="primary" variant="contained"
            onClick={handleJoinDialogOpen}>
            Join
          </Button>
          <JoinDialog open={joinDialogOpen} handleClose={handleJoinDialogClose} username={username} />
        </Box>
      </Paper>
    </Box>
  );
}
export default MainMenu;