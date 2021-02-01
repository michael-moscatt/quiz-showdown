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
  }
}));

function QuestionCard(props){
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const [startDate, setStartDate] = useState(null);
  const [curDate, setCurDate] = useState(null);
  const [timeTotal, setTimeTotal] = useState(null);

  const [title, setTitle] = 
    useState(props.value ? props.category + ' ' + props.value : props.category);
  const [body, setBody] = useState('');

  const [wagerOpen, setWagerOpen] = useState(false);
  const [wagerMax, setwagerMax] = useState(0);

  function setEventListeners() {
    socket.on('time-clear', () => {
      setStartDate(null);
    });
    socket.on('time-initial', time => {
      setTimeTotal(time);
      setStartDate(Date.now());
    });

    socket.on('question', question => setBody(parse(question)));

    socket.on('request-final-wager', max => {
      setwagerMax(max);
      setWagerOpen(true);
    });
    socket.on('final-time-up', (msg) => {
      setTitle(msg);
    });
    socket.on('final-info', (obj) => {
      setBody('');
      setTitle(obj.name + ' said:');
      setTimeout(() => {
        setBody(obj.givenAnswer);
      }, 1000);
      setTimeout(() => {
        let title = obj.correct ? "Which is correct!" : "Not what we were looking for";
        setTitle(title);
      }, 3000);
      setTimeout(() => {
        let title = "They wagered $" + obj.wager
        setTitle(title);
      }, 4500);
      setTimeout(() => {
        let title = "Which brings their final score to:";
        setTitle(title);
        setBody("");
      }, 6000);
      setTimeout(() => {
        setBody('$' + obj.finalScore);
      }, 6500);
    });
    socket.on('winners', (winString) => {
      setTitle('');
      setBody(winString);
    });

    return function removeEventListeners() {
      socket.off('time-clear');
      socket.off('time-initial');
      socket.off('question');
      socket.off('request-final-wager');
      socket.off('final-time-up');
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

  const timeLeft = timeTotal - (curDate - startDate);
  const timeFraction = (timeLeft / timeTotal) * 100;
    
  return (
    <Grid container justify="center">
      <Grid item xs={12} sm={11} md={10} lg={8}>
        <Paper className={classes.root} >
          <Grid container className={classes.container} justify="center">
            <Grid item className={classes.title} xs={12}>
              <Grid container>
                <Grid item xs={11}>
                  <Typography variant="h4">
                    {title}
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
                {body}
              </Typography>
              <WagerDialog open={wagerOpen} handleClose={handleWagerClose}
                  max={wagerMax} handlePlaceWager={handlePlaceWager} title={"Final Round"}/>
            </Grid>
            <Grid item className={classes.answer} xs={12}>
              <AnswerModule />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
export default QuestionCard;