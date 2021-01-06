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
        {view}
      </SocketContext.Provider>
    );
  }
}

export default App;
