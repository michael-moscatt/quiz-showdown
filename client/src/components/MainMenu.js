import React, { Component } from 'react';
import { SocketContext } from '../socket-context';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import JoinDialog from './JoinDialog.js';

const styles = theme => ({
  button: {
    width: 200
  }
});

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      joinDialogOpen: false
    }
    this.handleJoinDialogOpen = this.handleJoinDialogOpen.bind(this);
    this.handleJoinDialogClose = this.handleJoinDialogClose.bind(this);
    this.handleHostClick = this.handleHostClick.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  handleUsernameChange(e) {
    this.setState ({
      username: e.target.value
    });
  }

  handleJoinDialogOpen() {
    this.setState({
      joinDialogOpen: true
    });
  }

  handleJoinDialogClose() {
    this.setState({
      joinDialogOpen: false
    });
  }

  handleHostClick() {
    this.context.emit('host', this.state.username);
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="center">
        <Grid item xs={3}>
          <Paper elevation={3}>
            <Box p={4}>
            <Grid container spacing={1}>
              <Grid item align="center" xs={12}>
                <TextField className={classes.button} id="username" label="Name" variant="filled"
                  margin="dense" autoComplete="off" onChange={this.handleUsernameChange} inputProps={{ maxLength: 16 }} />
              </Grid>
              <Grid item align="center" xs={12}>
                <Button className={classes.button} size="large" color="primary" variant="contained"
                  onClick={this.handleHostClick}>
                  Host
                </Button>
              </Grid>
              <Grid item align="center" xs={12}>
                <Button className={classes.button} size="large" color="primary" variant="contained"
                  onClick={this.handleJoinDialogOpen}>
                  Join
                </Button>
                <JoinDialog open={this.state.joinDialogOpen} handleClose={this.handleJoinDialogClose} username={this.state.username} />
              </Grid>
              <Grid item align="center" xs={12}>
                <Button className={classes.button} size="large" color="primary" variant="contained">
                  About
                </Button>
              </Grid>
            </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
MainMenu.contextType = SocketContext;

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainMenu);