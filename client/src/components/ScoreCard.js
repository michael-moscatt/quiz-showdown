import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import TurnIndicator from './TurnIndicator';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200
  },
  full: {
    width: '100%',
    height: '100%'
  },
  turn: {
    marginTop: -30
  },
  title: {
    margin: theme.spacing(2)
  },
  score: {
    marginBottom: theme.spacing(2) 
  }
}));

function ScoreCard(props) {
  const classes = useStyles();

  const cardText = props.score < 0 ? `-$${props.score*-1}` : `$${props.score}`

  return (
    <Box className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Box className={classes.turn} display="flex" justifyContent="center" >
            {props.turn && <TurnIndicator />}
          </Box>
        </Grid>
        <Grid className={classes.full} item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Box className={classes.title} display="flex" justifyContent="center">
                <Typography variant="h6">
                  {props.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className={classes.score} display="flex" justifyContent="center">
                <Typography variant="h5">
                  {cardText}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
export default ScoreCard;