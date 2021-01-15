import React, { useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { SocketContext } from '../socket-context';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControlSeason: {
    minWidth: 80,
    margin: theme.spacing(1)
  },
  formControlMatch: {
    minWidth: 170,
    margin: theme.spacing(1)
  }
}));

function OptionsPanel(){
  const socket = useContext(SocketContext);
  const classes = useStyles();

  const [optionsEnabled, setOptionsEnabled] = useState(false);
  const [interrupt, setInterrupt] = useState(false);
  const [override, setOverride] = useState(true);
  const [seasons, setSeasons] = useState({});
  const [selectedSeason, setSelectedSeason] = useState('');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');

  const setEventListeners = function () {
    socket.on('is-host-response', response => setOptionsEnabled(response));
    socket.on('matches-list-response', (response) => {
      setSeasons(response);
    });
    socket.on('setting-override-change', response => setOverride(response));
    socket.on('setting-interrupt-change', response => setInterrupt(response));
    socket.on('setting-season-change',
      (response) => {
        setSelectedSeason(response);
      });
    socket.on('setting-match-change', response => setSelectedMatch(response));
  }
  useEffect(setEventListeners, [socket]);

  useEffect(() => socket.emit('request-lobby-settings'), [socket]);

  // Update matches whenever the underlying data, or the selected seasons change
  function updateMatches(){
    if(selectedSeason in seasons){
      setMatches(seasons[selectedSeason].map(match => match));
    } else{
      setMatches([]);
    }
  }
  useEffect(updateMatches, [seasons, selectedSeason]);

  function handleOverrideChange(event){
    setOverride(event.target.checked);
    socket.emit('setting-override-change', event.target.checked);
  }

  function handleMatchChange(event){
    setSelectedMatch(event.target.value);
    socket.emit('setting-match-change', event.target.value);
  }

  function handleSeasonChange(event){
    const season = event.target.value;
    setSelectedSeason(season);
    setSelectedMatch('');
    socket.emit('setting-season-change', season)
  }

  function handleInterruptChange(event){
    setInterrupt(event.target.checked);
    socket.emit('setting-interrupt-change', event.target.checked);
  }

  function handleStart(){
    socket.emit('start-game-request');
  }

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
                        checked={interrupt}
                        onChange={handleInterruptChange}
                        name="interrupt"
                        color="primary"
                        disabled={!optionsEnabled}
                      />
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel label="Host Override"
                    control={
                      <Checkbox
                        checked={override}
                        onChange={handleOverrideChange}
                        name="override"
                        color="primary"
                        disabled={!optionsEnabled}
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
                        value={selectedSeason}
                        onChange={handleSeasonChange}
                        disabled={!optionsEnabled}
                      >
                        {Object.keys(seasons).map((season) =>
                          <MenuItem key={season} value={season}>{season}</MenuItem>)}
                      </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl className={classes.formControlMatch}>
                    <InputLabel id="select-match-label">Match</InputLabel>
                      <Select
                        labelId="select-match-label"
                        id="select-match"
                        value={selectedMatch}
                        onChange={handleMatchChange}
                        disabled={!optionsEnabled}
                      >
                        {matches.map((match) =>
                          <MenuItem key={match.id} value={match.id}>{match.date}
                            <span>&nbsp;&nbsp;&nbsp;</span>#{match.id}
                          </MenuItem>)}
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
            <Button size="large" color="primary" variant="contained" onClick={handleStart}
                disabled={!optionsEnabled}>
                Start Game
            </Button>
          </Box>
        </Grid>
      </Grid>
      </Box>
    </Paper>
  )
}
export default OptionsPanel;