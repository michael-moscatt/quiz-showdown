import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import { SocketContext } from '../socket-context';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class OptionsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      interrupt: true,
      seasons: {},
      selectedSeason: '',
      matches: [],
      selectedMatch: ''
    }
    this.handleMatchChange = this.handleMatchChange.bind(this);
    this.handleSeasonChange = this.handleSeasonChange.bind(this);
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
    this.context.on('matches-list-response',
      (response) => {
        this.setState({
          seasons: response
        })
      });
    this.context.emit('request-matches-list');
  }

  handleMatchChange(event){
    this.setState({
      selectedMatch: event.target.value
    });
  }

  handleSeasonChange(event){
    const season = event.target.value;
    var matches = []
    this.state.seasons[season].forEach((match) => {
      matches.push(match);
    });
    this.setState({
      matches: matches,
      selectedSeason: season,
      selectedMatch: ''
    });
  }

  handleInterruptChange(event){
    this.setState({
      interrupt: event.target.checked
    });
  }

  handleStart(){
    
  }

  render() {
    const matches = this.state.matches.map((match) => 
      <MenuItem key={match.id} value={match.id}>{match.id} {match.date}</MenuItem>
    )
    const seasons = Object.keys(this.state.seasons).map((season) => 
      <MenuItem key={season} value={season}>{season}</MenuItem>
    )
    return (
      <Box mt={2}>
        <FormControlLabel label="Interrupt" control={
          <Switch checked={this.state.interrupt} onChange={this.handleInterruptChange} 
            name="interrupt" color="primary" disabled={!this.state.enabled} />}
        />
        <Button size="large" color="primary" variant="contained" onClick={this.handleStart}
          disabled={!this.state.enabled}>
          Start Game
        </Button>
        <FormControl>
          <InputLabel id="select-season-label">Season</InputLabel>
          <Select
            labelId="select-season-label"
            id="select-season"
            value={this.state.selectedSeason}
            onChange={this.handleSeasonChange}
          >
            {seasons}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="select-match-label">Match</InputLabel>
          <Select
            labelId="select-match-label"
            id="select-match"
            value={this.state.selectedMatch}
            onChange={this.handleMatchChange}
          >
            {matches}
          </Select>
        </FormControl>
      </Box>
    )
  }
}
OptionsPanel.contextType = SocketContext;

export default OptionsPanel;