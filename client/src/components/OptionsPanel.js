import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import { SocketContext } from '../socket-context';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

class OptionsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      interrupt: true,
    }
    this.handleInterruptChange = this.handleInterruptChange.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  componentDidMount() {
    this.context.on('is-host-response',
      (response) => {
        this.setState({
          enabled: response
        });
      });
    this.context.emit('request-is-host');
  }

  handleInterruptChange(event){
    this.setState({
      interrupt: event.target.checked
    });
  }

  handleStart(){
    
  }

  render() {
    return (
      <Box mt={2}>
        <FormControlLabel label="Interrupt" control={
          <Switch checked={this.state.interrupt} onChange={this.handleInterruptChange} 
            name="interrupt" color="primary" disabled={!this.state.enabled} />}
        />
        <Button size="large" color="primary" variant="contained" onClick={this.handleHostClick}
          disabled={!this.state.enabled}>
          Start Game
        </Button>
      </Box>
    )
  }
}
OptionsPanel.contextType = SocketContext;

export default OptionsPanel;