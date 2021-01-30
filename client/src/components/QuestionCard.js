import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../context/socket-context';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AnswerModule from './AnswerModule';
import { makeStyles } from "@material-ui/core/styles";
import parse from 'html-react-parser';
import DigitalTimer from './DigitalTimer';
import VisualTimer from './VisualTimer';

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
  }
}));

function QuestionCard(props){
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const [startDate, setStartDate] = useState(null);
  const [curDate, setCurDate] = useState(null);
  const [timeTotal, setTimeTotal] = useState(null);

  function setEventListeners() {
    socket.on('time-clear', () => {
      setStartDate(null);
    });
    socket.on('time-initial', time => {
      setTimeTotal(time);
      setStartDate(Date.now());
    });

    return function removeEventListeners() {
      socket.off('time-clear');
      socket.off('time-initial');
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

  
  const timeLeft = timeTotal - (curDate - startDate);
  const timeFraction = (timeLeft / timeTotal) * 100;

  return (
    <Paper className={classes.root} >
      <Grid container className={classes.container} justify="center">
        <Grid item className={classes.title} xs={12}>
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="h4">
                {props.category} {props.value}
              </Typography>
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
          <Typography variant="h5">
            {parse(props.question)}
          </Typography>
        </Grid>
        <Grid item className={classes.answer} xs={12}>
          <AnswerModule />
        </Grid>
      </Grid>
    </Paper>
  );
}
export default QuestionCard;