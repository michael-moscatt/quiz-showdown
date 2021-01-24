import React, { useContext, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { SocketContext } from '../socket-context';
import parse from 'html-react-parser';
import WagerDialog from './WagerDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400
  },
  container: {
    height: '100%'
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
  },
  title: {
    height: '20%',
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  question: {
    height: '55%',
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
    paddingTop: theme.spacing(10),
    paddingTBottom: theme.spacing(10),
  },
  answer: {
    height: '25%'
  }, 
  revealAnswerBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  }
}));

function FinalBoard(props) {
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const [mode, setMode] = useState('question');
  const [wagerOpen, setWagerOpen] = useState(false);
  const [wagerMax, setwagerMax] = useState(0);
  const [finalAnwer, setFinalAnswer] = useState('');
  const [revealTitle, setRevealTitle] = useState('');
  const [revealAnswer, setRevealAnswer] = useState('');

  function setEventListeners() {
    socket.on('request-final-wager', max => {
      setwagerMax(max);
      setWagerOpen(true);
    });
    socket.on('request-answer', () => {
      setMode('answer');
    });
    socket.on('final-answer-accepted', () => {
      setMode('question');
    });
    socket.on('final-info', (obj) => {
      setRevealAnswer('');
      setRevealTitle(obj.name + ' said:');
      setMode('reveal');
      setTimeout(() => {
        setRevealAnswer(obj.givenAnswer);
      }, 1000);
      setTimeout(() => {
        let title = obj.correct ? "Which is correct!" : "Not what we were looking for";
        setRevealTitle(title);
      }, 3000);
      setTimeout(() => {
        let title = "They wagered $" + obj.wager
        setRevealTitle(title);
      }, 4500);
      setTimeout(() => {
        let title = "Which brings their final score to:";
        setRevealTitle(title);
      }, 6000);
      setTimeout(() => {
        setRevealAnswer(obj.finalScore);
      }, 6500);
    });

    return function removeEventListeners() {
      socket.off('request-final-wager');
      socket.off('request-answer');
      socket.off('final-answer-accepted');
      socket.off('final-info');
    }
  }
  useEffect(setEventListeners, [socket]);

  function handleWagerClose(){
    setWagerOpen(false);
  }

  function handlePlaceWager(wager) {
    socket.emit('final-wager', wager);
    handleWagerClose();
  }

  function handleFinalAnswerChange(e){
    setFinalAnswer(e.target.value);
  }

  function handleSubmitFinalAnswer(){
    socket.emit('final-answer', finalAnwer);
  }

  const answerBox = 
    <Box className={classes.container} display="flex" alignItems="flex-end">
      <TextField className={classes.input} id="answer" label="Answer" inputProps={{ maxLength: 60 }}
        variant="outlined" autoComplete="off" onChange={handleFinalAnswerChange} autoFocus />
      <Button className={classes.button} color="primary" variant="contained"
        onClick={handleSubmitFinalAnswer}>
        Submit
      </Button>
    </Box>

  const revealAnswerBox =
    <Box className={classes.revealAnswerBox}>
      <Typography variant="h6">
        {revealAnswer}
      </Typography>
    </Box>

  return (
    <Grid container justify="center">
      <Grid item xs={12} sm={11} md={10} lg={8}>
        <Paper className={classes.root} >
          <Grid container className={classes.container} justify="center">
            <Grid item className={classes.title} xs={12}>
              <Typography variant="h4">
                {mode !== 'reveal' && props.category}
                {mode === 'reveal' && revealTitle}
                <hr></hr>
              </Typography>
            </Grid>
            <Grid item className={classes.question} xs={12}>
              {mode !== 'reveal' && <Typography variant="h6">
                {parse(props.question)}
                <WagerDialog open={wagerOpen} handleClose={handleWagerClose}
                  max={wagerMax} handlePlaceWager={handlePlaceWager} />
              </Typography>}
              {mode === 'reveal' && revealAnswerBox}
            </Grid>
            <Grid item className={classes.answer} xs={12}>
              {mode === 'answer' && answerBox}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
export default FinalBoard;