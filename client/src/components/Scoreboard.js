import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../socket-context';
import ScoreCard from './ScoreCard';

function Scoreboard(props){
    const socket = useContext(SocketContext);

    const [scores, setScores] = useState([]);

    const setEventListeners = function () {
        socket.on('request-scores-response', (response) => setScores(response));

        return function removeEventListeners(){
            socket.off('request-scores-response');
        }
    }
    useEffect(setEventListeners, [socket]);

    useEffect(() => socket.emit('request-scores'), [socket]);

    return (
        scores.map((pair) => {
            const isTurn = props.turn === pair.name
            return <ScoreCard name={pair.name} score={pair.score} turn={isTurn} key={pair.name}/>
        })
    );
}
export default Scoreboard;