import { Grid } from '@material-ui/core';
import React from 'react';
import Label from './Label';
import PlayerIcon from './PlayerIcon';

export type Props = {
    name: string,
    isWordMaster: boolean,
};

export default function PlayerHeader({ name, isWordMaster }: Props) {
    const roleName = `Word ${isWordMaster ? 'Master' : 'Detective'}`;
    return (
        <Grid container spacing={2} justify="flex-start" align-items="center">
            <Grid item>
                <PlayerIcon isWordMaster={isWordMaster} />
            </Grid>
            <Grid item style={{marginTop: 3}}>
                <Label kind="primary" size="h4" bold={true}>{ name }</Label>
                <Label kind="secondary" size="h4" bold={true}> - { roleName }</Label>
            </Grid>
        </Grid>
    )
}
