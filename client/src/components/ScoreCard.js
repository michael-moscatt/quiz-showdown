import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 200,
      margin: theme.spacing(2)
    },
    header: {
        textAlign: 'center'
    },
    content: {
        textAlign: 'center'
    }
  }));

function ScoreCard(props){
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardHeader className={classes.header} title={props.name} />
            <CardContent className={classes.content}>
                <Typography variant="h4">
                    ${props.score}
                </Typography>
            </CardContent>
        </Card>
    )
}
export default ScoreCard;