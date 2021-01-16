import React, { useContext, useState, useEffect } from 'react';
import CategoryCard from './CategoryCard.js';
import ValueCard from './ValueCard.js';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

function Gameboard(props){
    const categoryCards = props.categories.map((category) => 
        <CategoryCard name={category.name} comments={category.comments} />
    );
    const valueCards = props.values.map((row, rowInd) =>
        <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
                {row.map((val, ind) => 
                    <ValueCard value={val} onClick={props.handleClick} index={(rowInd*6)+ind}
                        active={props.active}/>
                )}
            </Box>
        </Grid>
    );

    return (
        <Grid container justify="center" >
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                    {categoryCards}
                </Box>
            </Grid>
            {valueCards}
        </Grid>
    );
}
export default Gameboard;