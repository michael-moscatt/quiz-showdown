import Box from '@material-ui/core/Box';
import { SocketContext } from '../context/socket-context';
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
    alignItems: "flex-end"
  },
  button: {
    width: 100,
    height: 55
  },
  input: {
    width: '80%',
    height: 55
  },
  opponentBox: {
    height: 55,
    padding: theme.spacing(2)
  },
  answerBox: {
    height: 55,
    width: '100%',
    display: 'flex', 
    justifyContent: 'center'
  },
  typography: {
    flexGrow: 1,
    textAlign: "center"
  },
  selfBuzz: {
    width: '100%',
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between"
  }
}));

function AnswerModule() {
  const socket = useContext(SocketContext);
  const classes = useStyles();

  const [mode, setMode] = useState('none');
  const [someoneBuzzed, setsomeoneBuzzed] = useState(true);
  const [lockedOut, setlockedOut] = useState(false);
  const [opponentAnswer, setOpponentAnswer] = useState('');
  const [opponentName, setopponentName] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [answer, setAnswer] = useState('');


  useEffect(() => {
    setsomeoneBuzzed(mode === 'self' || mode === 'opponent');
  }, [mode]);

  function setEventListeners() {
    socket.on('buzz-enable', () => setMode('default'));
    socket.on('opponent-buzz', (name) => {
      setMode('opponent');
      setopponentName(name);
      setOpponentAnswer('');
    });
    socket.on('answer-stream', (text) => setOpponentAnswer(text));
    socket.on('lockout-start', () => setlockedOut(true));
    socket.on('lockout-end', () => setlockedOut(false));
    socket.on('wrong-answer', () => {
      setlockedOut(true);
      setMode('default');
    });
    socket.on('opponent-wrong-answer', () => setMode('default'));
    socket.on('question-answer', (answer) => {
      setAnswer(answer);
      setMode('answer');
    });
    socket.on('request-answer', () => {
      setMode('self');
    });
    socket.on('clear-answer-input', () => {
      setMode('none');
    });
    return function removeEventListeners() {
      socket.off('buzz-enable');
      socket.off('opponent-buzz');
      socket.off('answer-stream');
      socket.off('lockout-start');
      socket.off('lockout-end');
      socket.off('wrong-answer');
      socket.off('opponent-wrong-answer');
      socket.off('question-answer');
      socket.off('request-answer');
      socket.off('clear-answer-input');
    }
  }
  useEffect(setEventListeners, [socket]);

  useEffect(() => socket.emit('answer-stream', myAnswer), [socket, myAnswer]);

  function handleBuzz(){
    socket.emit('request-buzz');
  }

  function handleChange(e){
    setMyAnswer(e.target.value);
  }

  function handleSubmit(){
    socket.emit('final-answer', myAnswer);
  }

  useEventListener('keydown', (event) => {
    if(event.key === " "){
      if(!someoneBuzzed && !lockedOut){
        socket.emit('request-buzz');
      }
    } else if(event.key === "Enter"){
      if(mode === 'self'){
        socket.emit('final-answer', myAnswer);
      }
    }
  });

  const buzzer = 
    <Button className={classes.button} size="large" color="primary" variant="contained"
      onClick={handleBuzz} disabled={someoneBuzzed || lockedOut} >
      Buzz
    </Button>

  const selfBuzz = 
    <Box className={classes.selfBuzz}>
      <TextField className={classes.input} id="answer" label="Answer" inputProps={{ maxLength: 60 }}
        variant="outlined" autoComplete="off" onChange={handleChange} autoFocus />
      <Button className={classes.button} color="primary" variant="contained"
        onClick={handleSubmit}>
        Submit
      </Button>
    </Box>

  const opponentBuzz = 
    <Box className={classes.opponentBox}>
      <Typography><strong>{opponentName}</strong>:&nbsp;{opponentAnswer}</Typography>
    </Box>

  const revealAnswer = 
    <Box className={classes.answerBox} justifyContent="center" >
      <Typography className={classes.typography} variant="h6" >
        <strong>{answer}</strong>
      </Typography>
    </Box>

  return (
    <Box className={classes.root}>
      {mode === 'default' && buzzer} 
      {mode === 'self' && selfBuzz}
      {mode === 'opponent' && opponentBuzz}
      {mode === 'answer' && revealAnswer}
    </Box>
  );
}
export default AnswerModule;