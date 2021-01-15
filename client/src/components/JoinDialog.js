import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { SocketContext } from '../socket-context';

function JoinDialog(props){
  const socket = useContext(SocketContext);

  const [room, setRoom] = useState('');
  function handleRoomChange(e){
    setRoom(e.target.value.toUpperCase());
  }

  function handleJoin(){
    socket.emit('join', {
      roomName: room,
      username: props.username
    })
  }

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Room Code"
          type="text"
          inputProps={{ maxLength: 6 }}
          value={room}
          onChange={handleRoomChange}
          autoComplete="off"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
          </Button>
        <Button onClick={handleJoin} color="primary">
          Join
          </Button>
      </DialogActions>
    </Dialog>
  );
}
export default JoinDialog;