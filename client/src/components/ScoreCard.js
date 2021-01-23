import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import TurnIndicator from './TurnIndicator';
import Box from '@material-ui/core/Box';
import HostOverrideHeader from './HostOverrideHeader';


const useStyles = makeStyles((theme) => ({
  card: {
    height: 100,
    width: 225
  },
  header: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  content: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  turnBox: {
    height: 30,
    margin: theme.spacing(0)
  },
  scoreBox: {
    margin: theme.spacing(0)
  }
}));

function ScoreCard(props) {
  const classes = useStyles();

  const cardText = props.score < 0 ? `-$${props.score*-1}` : `$${props.score}`

  return (
    <Grid container justify="center">
      <Grid item xs={12}>
        <Box className={classes.turnBox} display="flex" justifyContent="center">
        {props.turn ? <TurnIndicator /> : false}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.scoreBox} display="flex" justifyContent="center">
          <Card className={classes.card}>
            {props.isHost && <HostOverrideHeader name={props.name} />}
            {!props.isHost && 
              <CardHeader className={classes.header}
                title={props.name}
              />}
            <CardContent className={classes.content}>
              <Typography variant="h5">
                {cardText}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}
export default ScoreCard;