import Scoreboard from './Scoreboard.js';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

function GamePage() {
    return (
        <Grid container justify="center">
            <Grid item xs={12} md={10} lg={8}>
                <Box display="flex" justifyContent="center" m={3}>
                    <Scoreboard />
                </Box>
            </Grid>
        </Grid>
    )
}
export default GamePage;