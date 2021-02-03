import { makeStyles } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";
import ValueCard from './ValueCard.js';

const useStyles = makeStyles((theme) => ({
  catBox: {
    height: '100%',
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  valueBox: {
    height: '100%',
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  full: {
    height: '100%',
    width: '100%'
  }
}));

function CategoryCard(props) {
  const classes = useStyles(props);

  const values = props.values.map((pair, index) => {
    let trueIndex = (index * 6) + props.index;
    return <ValueCard value={pair[0]} status={pair[1]} click={props.click} index={trueIndex}
      active={props.active} key={index} />
  });

  return (
    <Box className={classes.full}>
      <Grid container className={classes.full}>
        <Grid item xs={4}>
          <Box className={classes.catBox}>
            <Typography variant="h6">
              {props.name}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box className={classes.valueBox}>
            {values}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
export default CategoryCard;