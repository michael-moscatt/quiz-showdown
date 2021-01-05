import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box'
import { withStyles } from '@material-ui/core/styles';

class Lobby extends Component {
    constructor(props) {
      super(props);
    }

  render() {
    return (
      <Box mt={2}>
        Room Code: {this.props.roomName}
      </Box>
    )
  }
}

Lobby.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles()(Lobby);