import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

function DDWagerDialog(props){

  const [wager, setWager] = useState(0);

  function handleSliderChange(event, newWager){
    setWager(newWager);
  }

  function handlePlaceWager(){
    props.handlePlaceWager(wager);
  }

  const handleInputWager = (event) => {
    setWager(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (wager < 0) {
      setWager(0);
    } else if (wager > props.max) {
      setWager(props.max);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogContent>
      <Typography id="input-slider" gutterBottom>
        Wager
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof wager === 'number' ? wager : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={wager}
            margin="dense"
            onChange={handleInputWager}
            onBlur={handleBlur}
            inputProps={{
              step: 100,
              min: 0,
              max: props.max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePlaceWager} color="primary">
          Place Wager
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default DDWagerDialog;