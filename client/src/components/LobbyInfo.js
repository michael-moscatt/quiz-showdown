import React, { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../socket-context';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/Star';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PersonIcon from '@material-ui/icons/Person';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: 100
  }
}));

function LobbyInfo(){
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState('');
  const [roomName, setRoomName] = useState('');

  const setEventListeners = function(){
    socket.on('usernames',
      (response) => {
        setPlayers(response.users);
        setHost(response.hostName);
      });
    socket.emit('request-usernames');
    socket.on('room-name',
      (response) => {
        setRoomName(response);
      });
    socket.emit('request-room-name');
  }
  useEffect(setEventListeners, [socket]);

  return (
    <Card>
      <CardContent className={classes.card}>
        <CardHeader title={"Room Code: " + roomName} />
        <Box>
          <List>
            <ListItem key={host}>
              <ListItemAvatar>
                <Avatar>
                  <StarIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={host}
              />
            </ListItem>
            {players.map((player) =>
              (<ListItem key={player}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={player}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="make-host">
                    <ArrowUpwardIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>))}
          </List>
        </Box>
      </CardContent>
    </Card>
  )
}
export default LobbyInfo;