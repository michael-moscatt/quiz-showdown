import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../context/socket-context';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AnswerModule from './AnswerModule';
import { makeStyles } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import parse from 'html-react-parser';
import DigitalTimer from './DigitalTimer';
import VisualTimer from './VisualTimer';
import WagerDialog from './WagerDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400
  },
  container: {
    height: '100%'
  },
  title: {
    height: '20%',
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  bar: {
    height: '5%'
  },
  question: {
    height: '50%',
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

function QuestionCard(props){
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const [startDate, setStartDate] = useState(null);
  const [curDate, setCurDate] = useState(null);
  const [timeTotal, setTimeTotal] = useState(null);

  const [mode, setMode] = useState('question');
  const [wagerOpen, setWagerOpen] = useState(false);
  const [wagerMax, setwagerMax] = useState(0);
  const [finalAnwer, setFinalAnswer] = useState('');
  const [revealTitle, setRevealTitle] = useState('');
  const [revealAnswer, setRevealAnswer] = useState('');

  function setEventListeners() {
    socket.on('time-clear', () => {
      setStartDate(null);
    });
    socket.on('time-initial', time => {
      setTimeTotal(time);
      setStartDate(Date.now());
    });

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
        setRevealAnswer("");
      }, 6000);
      setTimeout(() => {
        setRevealAnswer('$' + obj.finalScore);
      }, 6500);
    });
    socket.on('winners', (winString) => {
      setRevealTitle('');
      setRevealAnswer(winString);
    });

    return function removeEventListeners() {
      socket.off('time-clear');
      socket.off('time-initial');
      socket.off('request-final-wager');
      socket.off('request-answer');
      socket.off('final-answer-accepted');
      socket.off('final-info');
      socket.off('winners');
    }
  }
  useEffect(setEventListeners, [socket]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurDate(Date.now());
    }, 50);
    return () => {
      clearInterval(timer);
    }
  }, []);

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

  const timeLeft = timeTotal - (curDate - startDate);
  const timeFraction = (timeLeft / timeTotal) * 100;

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
  
  function getTitle(){
    if(props.final){
      if(mode !== 'reveal'){
        return props.category;
      }
      return revealTitle;
    }
    return props.category + ' ' + props.value;
  }

  function getBody(){
    if(props.final && mode === 'reveal'){
      return revealAnswerBox;
    }
    return parse(props.question);
  }
  
  const paperTitle =
    <Typography variant="h4">
      {getTitle()}
    </Typography>
  
  const paperBody =
    <Typography variant="h5">
      {getBody()}
    </Typography>

  return (
    <Grid container justify="center">
      <Grid item xs={12} sm={11} md={10} lg={8}>
        <Paper className={classes.root} >
          <Grid container className={classes.container} justify="center">
            <Grid item className={classes.title} xs={12}>
              <Grid container>
                <Grid item xs={11}>
                  {paperTitle}
                </Grid>
                <Grid item xs={1}>
                  {startDate && <DigitalTimer time={timeLeft} />}
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={classes.bar} xs={12}>
              {<VisualTimer fraction={timeFraction} />}
            </Grid>
            <Grid item className={classes.question} xs={12}>
              {paperBody}
              <WagerDialog open={wagerOpen} handleClose={handleWagerClose}
                  max={wagerMax} handlePlaceWager={handlePlaceWager} title={"Final Round"}/>
            </Grid>
            <Grid item className={classes.answer} xs={12}>
              {!props.final && <AnswerModule />}
              {props.final && mode === 'answer' && answerBox}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
export default QuestionCard;