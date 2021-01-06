import React, { Component } from 'react';
import { SocketContext } from '../socket-context';
import Box from '@material-ui/core/Box';

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      host: ""
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
  }

  render() {
    const players = this.state.players.map((player) =>  
      <li key={player}>
        {player}
      </li>
    );
    return (
      <Box>
        <ul>
          <li>{this.state.host}</li>
          {players}
        </ul>
      </Box>
    )
  }
}
PlayerList.contextType = SocketContext;

export default PlayerList;