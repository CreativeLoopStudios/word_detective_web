import React from 'react';

import { Grid } from '@material-ui/core';

import Label from './Label';
import PlayerIcon from './PlayerIcon';

export type Props = {
    name: string,
    isWordMaster: boolean,
};

export default function PlayerHeader({ name, isWordMaster }: Props) {
    const roleName = `Word ${isWordMaster ? 'Master' : 'Detective'}`;

    return (
        <Grid container spacing={2} justify="center" align-items="flex-start">
            <Grid item style={{ marginTop: 6 }}>
                <PlayerIcon isWordMaster={isWordMaster} />
            </Grid>
            <Grid item>
                <Label inline kind="primary" size="h5" bold>{name}</Label>
            </Grid>
            <Grid item>
                <Label inline kind="secondary" size="h5" bold>{roleName}</Label>
            </Grid>
        </Grid>
    )
}
