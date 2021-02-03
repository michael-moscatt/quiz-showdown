import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../context/socket-context';
import Scoreboard from './Scoreboard.js';
import Gameboard from './Gameboard.js';
import QuestionCard from './QuestionCard.js';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import WagerDialog from './WagerDialog';

function GamePage() {
  const socket = useContext(SocketContext);

  const [mode, setMode] = useState('board');
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState([]);
  const [turnName, setTurnName] = useState('');
  const [name, setName] = useState('');
  const [myTurn, setMyTurn] = useState(false);
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [wagerDialogOpen, setWagerDialogOpen] = useState(false);
  const [wagerMax, setWagerMax] = useState(0);
  const [isHost, setIsHost] = useState(false);

  function setEventListeners() {
    socket.on('categories', cat => setCategories(cat));
    socket.on('question-values', vals => setValues(vals));
    socket.on('turn-name', name => setTurnName(name));
    socket.on('name', name => setName(name));
    socket.on('daily-double', (max) => {
      setWagerMax(max);
      setWagerDialogOpen(true);
    });

    socket.on('question-info', (category, value) => {
      setCategory(category);
      setValue(value);
      setMode('question');
    });
    
    socket.on('question-over', () => {
      setMode('board');
    });
    socket.on('is-host', (isHost) => setIsHost(isHost));
    socket.on('start-final', (category) => {
      setCategory(category);
      setValue(null);
      setMode('question');
    });
    return function removeEventListeners() {
      socket.off('categories');
      socket.off('question-values');
      socket.off('turn-name');
      socket.off('name');
      socket.off('daily-double');
      socket.off('question-info')
      socket.off('question-over');
      socket.off('is-host');
      socket.off('start-final');
      socket.off('final-time-up');
    }
  }
  useEffect(setEventListeners, [socket]);

  useEffect(() => socket.emit('request-categories'), [socket]);
  useEffect(() => socket.emit('request-question-values'), [socket]);
  useEffect(() => socket.emit('request-turn-name'), [socket]);
  useEffect(() => socket.emit('request-name'), [socket]);
  useEffect(() => socket.emit('request-is-host'), [socket]);
  useEffect(() => setMyTurn(turnName === name), [turnName, name]);

  function handleValueCard(index) {
    socket.emit('request-take-turn', index);
  }

  function handleWagerDialogClose() {
    setWagerDialogOpen(false);
  }

  function handlePlaceWager(wager) {
    socket.emit('daily-double-wager', wager);
    handleWagerDialogClose();
  }

  const question =
    <Grid item sm={12} md={10} lg={7} xl={5}>
      <Box display="flex" justifyContent="center">
        <QuestionCard category={category} value={value} />
      </Box>
    </Grid>

  const board =
    <Grid item sm={12} md={11} lg={9} xl={7}>
      <Box display="flex" justifyContent="center">
        <Gameboard categories={categories} values={values} handleClick={handleValueCard}
          active={myTurn} />
      </Box>
    </Grid>

  const score =
    <Grid sm={12}>
      <Box display="flex" justifyContent="center">
        <Scoreboard turn={turnName} isHost={isHost} />
      </Box>
    </Grid>

  return (
    <Grid container justify="center">
      {mode === 'board' && board}
      {mode === 'question' && question}
      {score}
      <WagerDialog open={wagerDialogOpen} handleClose={handleWagerDialogClose}
          max={wagerMax} handlePlaceWager={handlePlaceWager}
          title={"Daily Double"} />
    </Grid>
  );
}
export default GamePage;