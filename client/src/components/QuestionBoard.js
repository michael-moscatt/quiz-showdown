import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  box: {
    height: '100%'
  },
  header: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  content: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  card: {
    width: '100%',
    height: '100%'
  }

}));

function QuestionBoard(props) {
  const classes = useStyles();

  return (
    <Grid container justify="center" >
      <Grid item xs={12} lg={11} key={0}>
        <Box className={classes.box} display="flex" justifyContent="center">
          <Card className={classes.card}>
            <CardHeader className={classes.header} title={props.category + ' ' + props.value}/>
            <CardContent className={classes.content}>
              <Typography variant="h5">
                {props.question}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}
export default QuestionBoard;