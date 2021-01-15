import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../socket-context';
import ScoreCard from './ScoreCard';

function Scoreboard(){
    const socket = useContext(SocketContext);

    const [scores, setScores] = useState([]);

    const setEventListeners = function () {
        socket.on('request-scores-response', (response) => setScores(response));
    }
    useEffect(setEventListeners, [socket]);

    useEffect(() => socket.emit('request-scores'), [socket]);

    useEffect(() => socket.emit('add-200'), [socket]);

    return (
        scores.map((pair) => {
            return <ScoreCard name={pair.name} score={pair.score} />
        })
    )
}
export default Scoreboard;