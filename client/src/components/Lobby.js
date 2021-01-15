import React from 'react';
import Container from '@material-ui/core/Container';
import LobbyInfo from './LobbyInfo.js';
import OptionsPanel from './OptionsPanel.js';
import Grid from '@material-ui/core/Grid';

function Lobby(){
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
export default Lobby;