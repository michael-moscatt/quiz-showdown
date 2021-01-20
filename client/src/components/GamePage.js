import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../socket-context';
import Scoreboard from './Scoreboard.js';
import Gameboard from './Gameboard.js';
import QuestionBoard from './QuestionBoard.js';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  box: {
    height: 550
  }
}));

function GamePage() {
    const socket = useContext(SocketContext);
    const classes = useStyles();

    const [mode, setMode] = useState('board');
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState([]);
    const [turnName, setTurnName] = useState('');
    const [name, setName] = useState('');
    const [myTurn, setMyTurn] = useState(false);
    const [category, setCategory] = useState('');
    const [value, setValue] = useState('');
    const [question, setQuestion] = useState('');

    function setEventListeners() {
        socket.on('categories', cat => setCategories(cat));
        socket.on('question-values', vals => setValues(vals));
        socket.on('turn-name', name => setTurnName(name));
        socket.on('name', name => setName(name));
        socket.on('question-info', (category, value) => {
            setMode('question');
            setQuestion('');
            setCategory(category);
            setValue(value);
        });
        socket.on('question', question => setQuestion(question));
        socket.on('question-over', () => setMode('board'));
        return function removeEventListeners() {
            socket.off('categories');
            socket.off('question-values');
            socket.off('turn-name');
            socket.off('name');
            socket.off('question-info');
            socket.off('question');
            socket.off('question-over');
        }
    }
    useEffect(setEventListeners, [socket]);

    useEffect(()=>socket.emit('request-categories'), [socket]);
    useEffect(()=>socket.emit('request-question-values'), [socket]);
    useEffect(()=>socket.emit('request-turn-name'), [socket]);
    useEffect(()=>socket.emit('request-name'), [socket]);
    useEffect(()=>setMyTurn(turnName === name), [turnName, name]);

    function handleValueCard(index){
        socket.emit('request-take-turn', index);
    }

    return (
        <Grid container justify="center">
            <Grid item xs={12} lg={10}>
                <Box className={classes.box} display="flex" justifyContent="center" m={1}>
                    {mode === 'board' ? 
                    <Gameboard categories={categories} values={values} handleClick={handleValueCard}
                        active={myTurn} /> : 
                    <QuestionBoard category={category} value={value} question={question}/>}
                </Box>
            </Grid>
            <Grid item xs={12} lg={10}>
                <Box display="flex" justifyContent="center" m={1}>
                    <Scoreboard turn={turnName}/>
                </Box>
            </Grid>
        </Grid>
    );
}
export default GamePage;