import CategoryCard from './CategoryCard.js';
import ValueCard from './ValueCard.js';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  grid: {
    height: '100%'
  },
  box: {
    height: '100%'    
  },
  root: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: theme.palette.grey[900],
    borderTopLeftRadius: theme.shape.borderRadius * 1.5,
    borderTopRightRadius: theme.shape.borderRadius * 1.5
  }
}));

function Gameboard(props) {
  const classes = useStyles();
  const categoryCards = props.categories.map((category, ind) => {
    let borders = [];
    if(ind === 0){
      borders.push('left');
    }
    if(ind === props.categories.length - 1){
      borders.push('right');
    }
    return <CategoryCard name={category.name} comments={category.comments} key={category.name} 
      borders={borders}/>
  });
  const valueCards = props.values.map((row, rowInd) => {
    return <Grid item xs={12} key={rowInd + 1}>
      <Box className={classes.box} display="flex" justifyContent="center">
        {row.map((pair, ind) => {
          let index = (rowInd * 6) + ind;
          return <ValueCard value={pair[0]} onClick={props.handleClick} index={index}
            active={props.active} key={index} status={pair[1]} />
        })}
      </Box>
    </Grid>
  });

  return (
    <Box className={classes.root}>
      <Grid container justify="center" className={classes.grid}>
        <Grid item xs={12}>
          <Box className={classes.box} display="flex" justifyContent="center">
            {categoryCards}
          </Box>
        </Grid>
        {valueCards}
      </Grid>
    </Box>
  );
}
export default Gameboard;