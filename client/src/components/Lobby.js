import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import PlayerList from './PlayerList.js';
import OptionsPanel from './OptionsPanel.js';
import { SocketContext } from '../socket-context';

class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      roomName: ""
    }
  }

  componentDidMount(){
    this.context.on('room-name', 
      (response) => {
        this.setState({
          roomName: response
        });
      });
    this.context.emit('request-room-name');
  }

  render() {
    return (
      <Box mt={2}>
        Room Code: {this.state.roomName}
        <PlayerList />
        <OptionsPanel />
      </Box>
    )
  }
}
Lobby.contextType = SocketContext;

export default Lobby;