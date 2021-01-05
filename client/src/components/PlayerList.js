import React, { Component } from 'react';
import { SocketContext } from '../socket-context';
import PropTypes from 'prop-types';

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: []
    }
  }

  render() {
    return (
      <h1>playerlist</h1>
    )
  }
}
PlayerList.contextType = SocketContext;

PlayerList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default PlayerList;