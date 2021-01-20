import Box from '@material-ui/core/Box';
import { SocketContext } from '../socket-context';
import React, { useContext, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import useEventListener from '../hooks/useEventListener'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: "center"
  },
  button: {
    margin: theme.spacing(2),
    width: 100,
    height: 55
  },
  input: {
    margin: theme.spacing(2),
    width: 350,
    height: 55
  }
}));

function AnswerModule() {
  const socket = useContext(SocketContext);
  const classes = useStyles();

  const [mode, setMode] = useState('default');
  const [someoneBuzzed, setsomeoneBuzzed] = useState(true);
  const [lockedOut, setlockedOut] = useState(false);
  const [opponentText, setOpponentText] = useState('');
  const [opponentName, setopponentName] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => mode === 'default' ? setsomeoneBuzzed(false) : setsomeoneBuzzed(true), [mode]);

  function setEventListeners() {
    socket.on('opponent-buzz', (name) => {
      setMode('opponent');
      setopponentName(name);
      setOpponentText('');
    });
    socket.on('buzz-accepted', () => setMode('self'));
    socket.on('answer-stream', (text) => setOpponentText(text));
    socket.on('lockout-start', () => setlockedOut(true));
    socket.on('lockout-end', () => setlockedOut(false));
    socket.on('wrong-answer', () => {
      setlockedOut(true);
      setMode('default');
    });
    socket.on('opponent-wrong-answer', () => setMode('default'));
    return function removeEventListeners() {
      socket.off('opponent-buzz');
      socket.off('buzz-accepted');
      socket.off('answer-stream');
      socket.off('lockout-start');
      socket.off('lockout-end');
      socket.off('wrong-answer');
      socket.off('opponent-wrong-answer');
    }
  }
  useEffect(setEventListeners, [socket]);

  useEffect(() => socket.emit('answer-stream', answer), [socket, answer]);

  function handleBuzz(){
    socket.emit('request-buzz');
  }

  function handleChange(e){
    setAnswer(e.target.value);
  }

  function handleSubmit(){
    socket.emit('final-answer', answer);
  }

  useEventListener('keydown', (event) => {
    if(event.key === " "){
      if(!someoneBuzzed && !lockedOut){
        socket.emit('request-buzz');
      }
    } else if(event.key === "Enter"){
      if(mode === 'self'){
        socket.emit('final-answer', answer);
      }
    }
  });

  const buzzer = 
    <Button className={classes.button} size="large" color="primary" variant="contained"
      onClick={handleBuzz} disabled={someoneBuzzed || lockedOut} >
      Buzz
    </Button>

  const selfBuzz = 
    <Box className={classes.root}>
      <TextField className={classes.input} id="answer" label="Answer"
        variant="outlined" autoComplete="off" onChange={handleChange} autoFocus />
      <Button className={classes.button} color="primary" variant="contained"
        onClick={handleSubmit}>
        Submit
      </Button>
    </Box>

  const opponentBuzz = 
    <Box className={classes.root} m={2}>
      <Typography variant="h6" >{opponentName}:&nbsp;</Typography>
      <Typography>{opponentText}</Typography>
    </Box>

  return (
    <Box className={classes.root}>
      {mode === 'default' ? buzzer : false } 
      {mode === 'self' ? selfBuzz : false }
      {mode === 'opponent' ? opponentBuzz : false }
    </Box>
  );
}
export default AnswerModule;