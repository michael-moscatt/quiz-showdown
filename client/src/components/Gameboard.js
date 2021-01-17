import CategoryCard from './CategoryCard.js';
import ValueCard from './ValueCard.js';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    box: {
      height: '100%'
    }
  }));

function Gameboard(props){
    const classes = useStyles();
    const categoryCards = props.categories.map((category) => 
        <CategoryCard name={category.name} comments={category.comments} key={category.name}/>
    );
    const valueCards = props.values.map((row, rowInd) => {
        return <Grid item xs={12} lg={11} key={rowInd+1}>
            <Box className={classes.box} display="flex" justifyContent="center">
                {row.map((val, ind) => {
                    let index = (rowInd*6)+ind;
                    return <ValueCard value={val} onClick={props.handleClick} index={index}
                        active={props.active} key={index}/>
                })}
            </Box>
        </Grid>
    }
    );
// May have to add key to grid item? TODO:
    return (
        <Grid container justify="center" >
            <Grid item xs={12} lg={11}>
                <Box className={classes.box} display="flex" justifyContent="center">
                    {categoryCards}
                </Box>
            </Grid>
            {valueCards}
        </Grid>
    );
}
export default Gameboard;