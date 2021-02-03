import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/socket-context';
import ScoreCard from './ScoreCard';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import VerticalDivider from './VerticalDivider';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  box: {
      display: "flex"
  }
}));

function Scoreboard(props){
    const socket = useContext(SocketContext);
    const classes = useStyles();

    const [scores, setScores] = useState([]);

    const setEventListeners = function () {
        socket.on('request-scores-response', (response) => setScores(response));

        return function removeEventListeners(){
            socket.off('request-scores-response');
        }
    }
    useEffect(setEventListeners, [socket]);

    useEffect(() => socket.emit('request-scores'), [socket]);

    const scoreCards =
        scores.map((pair) => {
            const isTurn = props.turn === pair.name;
            return <ScoreCard name={pair.name} score={pair.score}
                key={pair.name} isHost={props.isHost} turn={isTurn}/>
        })

    const scoreCardsAndDividers = 
        scoreCards.map((e, i) => i < scoreCards.length - 1 ? 
            [e, <VerticalDivider />] : [e]).flat();

    return (
        <Paper className={classes.root}>
            <Box className={classes.box}>
            {scoreCardsAndDividers}
            </Box>
        </Paper>
    );
}
export default Scoreboard;