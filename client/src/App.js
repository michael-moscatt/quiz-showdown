import './App.css';
import {SocketContext} from './socket-context';
import * as io from 'socket.io-client';
import React from 'react';
import MainMenu from './components/MainMenu.js';
import Lobby from './components/Lobby.js';

const socket = io();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      mode: 'menu',
      room: ''
    };

    socket.on('host-response', 
      (roomName) => { 
        this.setState({
          mode: 'lobby',
          roomName: roomName
        });
      });
  }

  render() {
    var view;
    if(this.state.mode === 'menu'){
      view = <MainMenu />;
    } else if(this.state.mode === 'lobby'){
      view = <Lobby roomName={this.state.roomName} />;
    }
    return (
      <SocketContext.Provider value={socket}>
        {view}
      </SocketContext.Provider>
    );
  }
}

export default App;
