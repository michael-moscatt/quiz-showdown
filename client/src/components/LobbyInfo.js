import React, { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../context/socket-context';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/Star';
import PersonIcon from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    minHeight: 154
  },
  title: {
    textAlign: "center"
  },
  icon: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white
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
    
    socket.on('room-name',
      (response) => {
        setRoomName(response);
      });

    return function removeEventListeners(){
      socket.off('usernames');
      socket.off('room-name');
    }
  }
  useEffect(setEventListeners, [socket]);

  useEffect(() => {socket.emit('request-room-name')},[socket]);
  useEffect(() => {socket.emit('request-usernames')},[socket]);

  return (
    <Paper className={classes.root} >
      <Box>
        <Box className={classes.title}>
          <Typography variant="h5">
            {"Room Code: " + roomName}
          </Typography>
        </Box>
        <Divider />
        <Box>
          <List>
            <ListItem key={host}>
              <ListItemAvatar>
                <Avatar className={classes.icon}>
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
                <Avatar className={classes.icon}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={player}
              />
            </ListItem>))}
          </List>
        </Box>
      </Box>
    </Paper>
  )
}
export default LobbyInfo;