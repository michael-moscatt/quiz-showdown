import React, { useContext, useState, useEffect, useRef } from 'react';
import { SocketContext } from '../context/socket-context';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import JoinDialog from './JoinDialog.js';
import ErrorDialog from './ErrorDialog.js';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3)
  },
  menuItem: {
    width: 250,
    margin: theme.spacing(.5)
  },
  icon: {
    fontSize: 50,
    color: theme.palette.primary.light,
    margin: theme.spacing(2)
  }
}));

function MainMenu(){
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const [isError, setIsError] = useState(false);
  const [username, setUsername] = useState('');
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogText, setErrorDialogText] = useState('');
  const input = useRef(null);

  function handleUsernameChange(e) {
    setUsername(e.target.value);
    setIsError(false);
  }

  function handleJoinDialogOpen() {
    if(username === ''){
      handleBlankUsername();
    } else{
      setJoinDialogOpen(true);
    } 
  }

  function handleJoinDialogClose() {
    setJoinDialogOpen(false);
  }

  function handleHostClick() {
    if(username === ''){
      handleBlankUsername();
    } else{
      socket.emit('host', username);
    }
  }

  function handleBlankUsername() {
    setIsError(true);
    input.current.focus();
  }

  function handleErrorDialogClose() {
    setErrorDialogOpen(false);
  }

  function setEventListeners() {
    socket.on('join-error',
      (error) => {
        setJoinDialogOpen(false);
        setErrorDialogText(error);
        setErrorDialogOpen(true);
    });
    return function removeEventListeners() {
      socket.off('join-error');
    }
  }
  useEffect(setEventListeners, [socket]);

  return (
    <Box display="flex" justifyContent="center" mt={3} >
      <Paper className={classes.paper} elevation={3}>
        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <EmojiEventsIcon className={classes.icon} />
          <TextField 
            className={classes.menuItem} 
            id="username" 
            label="Name" 
            variant="filled"
            margin="dense" 
            autoComplete="off" 
            onChange={handleUsernameChange}
            inputProps={{ maxLength: 16 }} 
            error={isError}
            autoFocus
            inputRef={input}
          />
          <Button className={classes.menuItem} size="large" color="primary" variant="contained"
            onClick={handleHostClick}>
            Host
          </Button>
          <Button className={classes.menuItem} size="large" color="primary" variant="contained"
            onClick={handleJoinDialogOpen}>
            Join
          </Button>
          <JoinDialog 
            open={joinDialogOpen} 
            handleClose={handleJoinDialogClose} 
            username={username} 
          />
          <ErrorDialog 
            open={errorDialogOpen} 
            handleClose={handleErrorDialogClose} 
            text={errorDialogText} 
          />
        </Box>
      </Paper>
    </Box>
  );
}
export default MainMenu;