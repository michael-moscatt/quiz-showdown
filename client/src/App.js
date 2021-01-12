import {SocketContext} from './socket-context';
import * as io from 'socket.io-client';
import React from 'react';
import MainMenu from './components/MainMenu.js';
import Lobby from './components/Lobby.js';
import SiteName from './components/SiteName.js';
import Grid from '@material-ui/core/Grid';

const socket = io();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      mode: 'menu',
    };
  }

  componentDidMount(){
    socket.on('host-response', 
      (response) => { 
        if(response === "ok"){
          this.setState({
            mode: 'lobby'
          });
        }
      }
    );

    socket.on('join-response',
      (response) => {
        if(response === "ok") {
          this.setState({
            mode: 'lobby'
          });
        } else {
          console.log(response);
        }
      });
  }

  render() {
    var view;
    if(this.state.mode === 'menu'){
      view = <MainMenu />;
    } else if(this.state.mode === 'lobby'){
      view = <Lobby />;
    }
    return (
      <SocketContext.Provider value={socket}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SiteName />
          </Grid>
          <Grid item xs={12}>
            {view}
          </Grid>
        </Grid>
      </SocketContext.Provider>
    );
  }
}

export default App;
