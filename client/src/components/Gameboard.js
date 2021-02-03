import CategoryCard from './CategoryCard.js';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1000,
    height: 550,
    margin: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  grid: {
    height: '100%'
  },
  box: {
    height: '100%'
  }
}));

function Gameboard(props) {
  const classes = useStyles();

  const rows = props.values.map((row, rowInd) =>
    <Grid item xs={12} key={rowInd}>
      {rowInd !== 0 ? <Divider /> : false}
      <CategoryCard values={row} index={rowInd} name={props.categories[rowInd].name}
        active={props.active} click={props.handleClick} />
    </Grid>
  );

  return (
    <Paper className={classes.root} elevation={3}>
      <Grid container className={classes.grid}>
        {rows}
      </Grid>
    </Paper>
  );
}
export default Gameboard;