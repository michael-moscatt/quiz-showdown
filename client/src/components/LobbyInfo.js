import React, { Component } from 'react';
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
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';

const styles = theme => ({
  card: {
    minHeight: 100
  }
});

class LobbyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      host: "",
      roomName: ""
    }
  }

  componentDidMount(){
    this.context.on('usernames', 
      (response) => {
        this.setState({
          players: response.users,
          host: response.hostName
        });
      });
    this.context.emit('request-usernames');
    this.context.on('room-name', 
        (response) => {
          this.setState({
            roomName: response
          });
        });
    this.context.emit('request-room-name');
  }

  render() {
    const { classes } = this.props;
    const roomInfo = "Room Code: " + this.state.roomName;
    const players = this.state.players.map((player) => 
        <ListItem>
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
        </ListItem>
      );
    const host = 
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <StarIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary = {this.state.host}
        />
      </ListItem>
    return (
      <Card>
        <CardContent className={classes.card}>
          <CardHeader title={roomInfo} />
          <Box>
            <List>
              {host}
              {players}
            </List>
          </Box>
        </CardContent>
      </Card>
    )
  }
}
LobbyInfo.contextType = SocketContext;

LobbyInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LobbyInfo);