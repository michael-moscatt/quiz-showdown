import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import LobbyInfo from './LobbyInfo.js';
import OptionsPanel from './OptionsPanel.js';
import { SocketContext } from '../socket-context';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

class Lobby extends Component {
  render() {
    return (
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <OptionsPanel />
          </Grid>
          <Grid item xs={4}>
            <LobbyInfo />
          </Grid>
        </Grid>
      </Container>
    )
  }
}
Lobby.contextType = SocketContext;

export default Lobby;