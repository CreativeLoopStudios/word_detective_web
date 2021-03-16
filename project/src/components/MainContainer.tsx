import React from 'react';
import { Grid, makeStyles, Paper } from "@material-ui/core";

const useTypes = makeStyles(() => ({
    paper: {
        maxWidth: 900,
        minWidth: 500,
        minHeight: 300,
        borderRadius: '1rem',
        backgroundColor: 'rgba(0,0,0,.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
}));

export type Props = {
    children?: React.ReactNode,
}

function MainContainer({ children }: Props) {
    const classes = useTypes();
    return (
        <Paper elevation={1} className={classes.paper}>
            { children }
        </Paper>
    );
}

MainContainer.propTypes = {};
MainContainer.defaultProps = {};

export default MainContainer;