import React from 'react';

import { Grid, GridItemsAlignment, GridJustification, makeStyles, Paper } from "@material-ui/core";

import Logo from './Logo';

const useStyles = makeStyles(() => ({
    paper: {
        maxWidth: 1200,
        minWidth: 1000,
        minHeight: 700,
        borderRadius: '1rem',
        backgroundColor: 'rgba(33,33,33,.8)',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
    },
    container: {
        padding: '3rem 4rem'
    },
    sidebar: {
        background: 'black',
        width: '25%',
        height: '100%',
        borderRadius: '0 1rem 1rem 0',
        position: 'absolute',
        right: 0,
        display: 'flex',
        justifyContent: 'center'
    },
    sidebarContent: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '2rem'
    },
    logo: {
        flex: 1
    }
}));

export type Props = {
    sidebar?: React.ReactNode;
    children?: React.ReactNode;
    justify?: GridJustification;
    alignItems?: GridItemsAlignment;
}

function MainContainer({ sidebar, justify, alignItems, children }: Props) {
    const classes = useStyles();
    
    return (
        <Paper elevation={1} className={classes.paper}>
            <Grid container justify={justify} alignItems={alignItems}>
                <Grid item xs={sidebar ? 9 : 12} className={classes.container}>
                    {children}
                </Grid>
            </Grid>

            {
                sidebar &&
                <div className={classes.sidebar}>
                    <div className={classes.sidebarContent}>
                        <div className={classes.logo}>
                            <Logo variant="rect" size="small" />
                        </div>
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