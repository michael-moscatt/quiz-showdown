import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../context/socket-context';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AnswerModule from './AnswerModule';
import { makeStyles } from "@material-ui/core/styles";
import parse from 'html-react-parser';
import VisualTimer from './VisualTimer';
import WagerDialog from './WagerDialog';
import ValueCard from './ValueCard.js';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 850,
    height: 450,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  },
  full: {
    height: '100%',
    weight: '100%'
  },
  title: {
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  paperHolder: {
    display: "flex",
    justifyContent: "center",
  },
  question: {
    height: 250,
    width: '100%',
    display: "flex",
    justifyContent: props => props.center ? "center" : "flex-start",
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    color: theme.palette.grey[800],
    alignItems: props => props.center ? "center" : "flex-start"
  },
  questionGrid: {
    height: 250,
    display: "flex",
    alignItems: props => props.center ? "center" : "flex-start",
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    color: theme.palette.grey[800]
  },
  timer: {
    display: "flex",
    justifyContent: "center",
  }
}));

function QuestionCard(props){
  const classes = useStyles(props);
  const socket = useContext(SocketContext);

  const [startDate, setStartDate] = useState(null);
  const [curDate, setCurDate] = useState(null);
  const [timeTotal, setTimeTotal] = useState(null);

  const [title, setTitle] = 
    useState(props.category);
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
      setBody('');
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
      setTitle('Our winner is:');
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
    <Grid container>
      <Grid item className={classes.timer} xs={12}>
        <VisualTimer fraction={timeFraction} />
      </Grid>
      <Grid item className={classes.paperHolder} xs={12}>
        <Paper className={classes.root} >
          <Grid container className={classes.full}>
            <Grid item xs={12}>
              <Box className={classes.title}>
                <Typography variant="h5">
                  {title}
                </Typography>
                {props.value !== null && <ValueCard value={props.value} status={'unselected'}
                  click={false} index={0} active={false} />}
              </Box>
              <Divider />
            </Grid>
            <Grid item className={classes.questionGrid} xs={12}>
              <Box className={classes.question}>
                <Typography variant="h6">
                  {body}
                </Typography>
              </Box>
              <WagerDialog open={wagerOpen} handleClose={handleWagerClose}
                max={wagerMax} handlePlaceWager={handlePlaceWager} title={"Final Round"} />
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