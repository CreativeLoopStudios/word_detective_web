import React from 'react';
import { makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    paper: {
        maxWidth: 900,
        minWidth: 500,
        minHeight: 300,
        borderRadius: '1rem',
        backgroundColor: 'rgba(33,33,33,.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '4rem'
    },
    sidebar: {
        background: 'black',
        width: '30%',
        height: '100%',
        borderRadius: '0 1rem 1rem 0',
        position: 'absolute',
        right: 0,
        display: 'flex',
        justifyContent: 'center'
    },
    sidebarContent: {
        padding: '2rem'
    }
}));

export type Props = {
    sidebar?: React.ReactNode;
    children?: React.ReactNode;
}

function MainContainer({ sidebar, children }: Props) {
    const classes = useStyles();
    
    return (
        <Paper elevation={1} className={classes.paper}>
            {children}

            {
                sidebar &&
                <div className={classes.sidebar}>
                    <div className={classes.sidebarContent}>
                        {sidebar}
                    </div>
                </div>
            }
        </Paper>
    );
}

MainContainer.propTypes = {};
MainContainer.defaultProps = {};

export default MainContainer;