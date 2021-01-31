import {SocketContext} from './context/socket-context';
import * as io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu.js';
import Lobby from './components/Lobby.js';
import GamePage from './components/GamePage.js';
import SiteName from './components/SiteName.js';
import Grid from '@material-ui/core/Grid';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import myTheme from './context/myTheme-context.js';

const socket = io();

function App(){

  const [page, setPage] = useState('menu');

  function setEventListeners() {

    socket.on('host-response',
      (response) => {
        if (response === "ok") {
          setPage('lobby');
        }
      }
    );

    socket.on('join-lobby', () => {
      setPage('lobby');
    });

    socket.on('start-game', () => {
      setPage('game');
    });

    return function removeEventListeners(){
      socket.off('host-response');
      socket.off('join-accepted');
      socket.off('start-game');
    }
  }
  useEffect(setEventListeners, []);

  function getView(){
    if(page === 'menu'){
      return <MainMenu />;
    }
    if(page === 'lobby'){
      return <Lobby />;
    }
    if(page === 'game'){
      return <GamePage />
    }
  }

  return (
    <MuiThemeProvider theme={myTheme}>
      <CssBaseline />
      <SocketContext.Provider value={socket}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <SiteName />
            </Grid>
            <Grid item xs={12}>
              {getView()}
            </Grid>
          </Grid>
      </SocketContext.Provider>
    </MuiThemeProvider>
  );
}
export default App;
