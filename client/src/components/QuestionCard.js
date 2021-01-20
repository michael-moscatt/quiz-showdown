import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AnswerModule from './AnswerModule';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%'
  },
  container: {
    height: '100%'
  },
  title: {
    height: '15%',
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  question: {
    height: '70%',
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
    paddingTop: theme.spacing(10),
    paddingTBottom: theme.spacing(10),
  },
  answer: {
    height: '15%'
  }
}));

function QuestionCard(props){
  const classes = useStyles();

  return (
    <Paper className={classes.root} >
      <Grid container className={classes.container} justify="center">
        <Grid item className={classes.title} xs={12}>
          <Typography variant="h4">
            {props.category} {props.value}<hr></hr>
          </Typography>
        </Grid>
        <Grid item className={classes.question} xs={12}>
          <Typography variant="h6">
            {props.question}
          </Typography>
        </Grid>
        <Grid item className={classes.answer} xs={12}>
          <AnswerModule />
        </Grid>
      </Grid>
    </Paper>
  );
}
export default QuestionCard;