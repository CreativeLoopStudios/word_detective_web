import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';

import Label from './Label';
import PlayerIcon from './PlayerIcon';

const useStyles = makeStyles(() => ({
    alignCenter: {
        display: 'flex',
        alignItems: 'center'
    }
}));

export type Props = {
    name: string,
    isWordMaster: boolean,
};

export default function PlayerHeader({ name, isWordMaster }: Props) {
    const classes = useStyles();
    const roleName = `Word ${isWordMaster ? 'Master' : 'Detective'}`;

    return (
        <Grid container spacing={2}>
            <Grid item style={{ marginTop: 6 }}>
                <PlayerIcon isWordMaster={isWordMaster} />
            </Grid>
            <Grid item className={classes.alignCenter}>
                <Label inline kind="primary" size="h5" bold>{name}</Label>
            </Grid>
            <Grid item className={classes.alignCenter}>
                <Label inline kind="secondary" size="h5" bold>-</Label>
            </Grid>
            <Grid item className={classes.alignCenter}>
                <Label inline kind="secondary" size="h5" bold>{roleName}</Label>
            </Grid>
        </Grid>
    )
}
