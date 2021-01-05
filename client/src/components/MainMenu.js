import React, { Component } from 'react';
import {SocketContext} from '../socket-context';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    width: 150
  }
});

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.handleHostClick = this.handleHostClick.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
  }

  handleHostClick() {
    console.log("Host");
    this.context.emit('host');
  }

  handleJoinClick() {
    console.log("Join");
  }

  render() {
    const { classes } = this.props;
    return (
      <Box mt={5}>
        <Grid container spacing={1}>
          <Grid item align="center" xs={12}>
            <Button className={classes.button} size="large" color="primary" variant="contained" onClick={this.handleHostClick}>
              Host
            </Button>
          </Grid>
          <Grid item align="center" xs={12}>
            <Button className={classes.button} size="large" color="primary" variant="contained" onClick={this.handleJoinClick}>
              Join
            </Button>
          </Grid>
          <Grid item align="center" xs={12}>
            <Button className={classes.button} size="large" color="primary" variant="contained">
              About
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
MainMenu.contextType = SocketContext;

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainMenu);