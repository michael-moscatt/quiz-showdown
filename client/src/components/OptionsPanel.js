import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { SocketContext } from '../socket-context';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import { spacing } from '@material-ui/system';


const styles = theme => ({
  formControlSeason: {
    minWidth: 80,
    margin: theme.spacing(1)
  },
  formControlMatch: {
    minWidth: 170,
    margin: theme.spacing(1)
  }
});

class OptionsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      interrupt: false,
      hostOverride: true,
      seasons: {},
      selectedSeason: '',
      matches: [],
      selectedMatch: '',
      matchEnabled: false
    }
    this.generateMatchList = this.generateMatchList.bind(this);
    this.handleMatchChange = this.handleMatchChange.bind(this);
    this.handleSeasonChange = this.handleSeasonChange.bind(this);
    this.handleInterruptChange = this.handleInterruptChange.bind(this);
    this.handleOverrideChange = this.handleOverrideChange.bind(this);
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
    this.context.on('setting-override-change',
      (response) => {
        this.setState({
          hostOverride: response
        })
      });
    this.context.on('setting-interrupt-change',
      (response) => {
        this.setState({
          interrupt: response
        })
      });
    this.context.on('setting-season-change',
      (response) => {
        var matches = this.generateMatchList(response);
        this.setState({
          selectedSeason: response,
          matches: matches
        })
      });
    this.context.on('setting-match-change',
      (response) => {
        this.setState({
          selectedMatch: response
        })
      });
  }

  generateMatchList(season){
    var matches = [];
    this.state.seasons[season].forEach((match) => {
      matches.push(match);
    });
    return matches;
  }

  handleOverrideChange(event){
    this.setState({
      hostOverride: event.target.checked
    });
    this.context.emit('setting-override-change', event.target.checked);
  }

  handleMatchChange(event){
    this.setState({
      selectedMatch: event.target.value
    });
    this.context.emit('setting-match-change', event.target.value);
  }

  handleSeasonChange(event){
    const season = event.target.value;
    var matches = this.generateMatchList(season);
    this.setState({
      matches: matches,
      selectedSeason: season,
      selectedMatch: ''
    });
    this.context.emit('setting-season-change', season)
  }

  handleInterruptChange(event){
    this.setState({
      interrupt: event.target.checked
    });
    this.context.emit('setting-interrupt-change', event.target.checked);
  }

  handleStart(){
    this.context.emit('start-game-request');
  }

  render() {
    const { classes } = this.props;
    const matches = this.state.matches.map((match) => 
      <MenuItem key={match.id} value={match.id}>{match.date}<span>&nbsp;&nbsp;&nbsp;</span>#{match.id}</MenuItem>
    )
    const seasons = Object.keys(this.state.seasons).map((season) => 
      <MenuItem key={season} value={season}>{season}</MenuItem>
    )
    return (
      <Paper m={5}>
        <Box py={3}>
        <Grid container>
          <Grid item sm={8}>
            <Grid container justify="center">
              <Grid item xs={12}>
                <Grid container justify="center" spacing={3}>
                  <Grid item>
                    <FormControlLabel label="Interrupt"
                      control={
                        <Checkbox
                          checked={this.state.interrupt}
                          onChange={this.handleInterruptChange}
                          name="interrupt"
                          color="primary"
                          disabled={!this.state.enabled}
                        />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel label="Host Override"
                      control={
                        <Checkbox
                          checked={this.state.override}
                          onChange={this.handleOverrideChange}
                          name="override"
                          color="primary"
                          disabled={!this.state.enabled}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="center" spacing={3}>
                  <Grid item>
                    <FormControl className={classes.formControlSeason}>
                      <InputLabel id="select-season-label">Season</InputLabel>
                      <Select
                        labelId="select-season-label"
                        id="select-season"
                        value={this.state.selectedSeason}
                        onChange={this.handleSeasonChange}
                        disabled={!this.state.enabled}
                      >
                        {seasons}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl className={classes.formControlMatch}>
                      <InputLabel id="select-match-label">Match</InputLabel>
                      <Select
                        labelId="select-match-label"
                        id="select-match"
                        value={this.state.selectedMatch}
                        onChange={this.handleMatchChange}
                        disabled={!this.state.enabled}
                      >
                        {matches}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={4}>
            <Box 
              height={1} 
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button size="large" color="primary" variant="contained" onClick={this.handleStart}
                  disabled={!this.state.enabled}>
                  Start Game
              </Button>
            </Box>
          </Grid>
        </Grid>
        </Box>
      </Paper>
    )
  }
}
OptionsPanel.contextType = SocketContext;

OptionsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OptionsPanel);