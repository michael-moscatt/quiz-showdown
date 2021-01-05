import React, { Component } from 'react';
import Box from '@material-ui/core/Box'

class Lobby extends Component {

  render() {
    return (
      <Box mt={2}>
        Room Code: {this.props.roomName}
      </Box>
    )
  }
}

export default Lobby;