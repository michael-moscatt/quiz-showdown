import Grid from '@material-ui/core/Grid';
import QuestionCard from './QuestionCard';

function QuestionBoard(props) {

  return (
    <Grid container justify="center">
      <Grid item xs={12} sm={11} md={10} lg={8}>
          <QuestionCard question={props.question} category={props.category} value={props.value}/>
      </Grid>
    </Grid>
  );
}
export default QuestionBoard;