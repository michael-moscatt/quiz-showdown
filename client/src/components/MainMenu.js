import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../socket-context';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import JoinDialog from './JoinDialog.js';

const useStyles = makeStyles((theme) => ({
  button: {
    width: 200
  },
  paper: {
    maxWidth: 300
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
    socket.on('join-response',
      (response) => {
        if(response === "invalid"){
          // TODO
        }
    });
    return function removeEventListeners() {
      socket.off('join-response');
    }
  }
  useEffect(setEventListeners, [socket]);

  return (
    <Grid container justify="center">
      <Grid item xs={12}>
        <Box justifyContent="center" display="flex">
          <Paper className={classes.paper} elevation={3}>
            <Box p={4}>
              <Grid container spacing={1}>
                <Grid item align="center" xs={12}>
                  <TextField className={classes.button} id="username" label="Name" variant="filled"
                    margin="dense" autoComplete="off" onChange={handleUsernameChange}
                    inputProps={{ maxLength: 16 }} />
                </Grid>
                <Grid item align="center" xs={12}>
                  <Button className={classes.button} size="large" color="primary" variant="contained"
                    onClick={handleHostClick}>
                    Host
                </Button>
                </Grid>
                <Grid item align="center" xs={12}>
                  <Button className={classes.button} size="large" color="primary" variant="contained"
                    onClick={handleJoinDialogOpen}>
                    Join
                </Button>
                  <JoinDialog open={joinDialogOpen} handleClose={handleJoinDialogClose} username={username} />
                </Grid>
                <Grid item align="center" xs={12}>
                  <Button className={classes.button} size="large" color="primary" variant="contained">
                    About
                </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}
export default MainMenu;