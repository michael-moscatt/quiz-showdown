import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { SocketContext } from '../socket-context';

class JoinDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      room: ""
    }
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
  }

  componentDidMount(){
    this.context.on('join-response',
      (response) => {
        if(response === "invalid"){
          // TODO
        }
      }
    );
  }

  handleRoomChange(e){
    this.setState({
      room: e.target.value.toUpperCase()
    });
  }

  handleJoin(){
    this.context.emit('join', {
      roomName: this.state.room,
      username: this.props.username
    })
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Code"
            type="text"
            inputProps = {{maxLength:6}}
            value={this.state.room}
            onChange={this.handleRoomChange}
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleJoin} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
JoinDialog.contextType = SocketContext;

export default JoinDialog;