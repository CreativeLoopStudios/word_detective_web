import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';

import Label from './Label';
import PlayerIcon from './PlayerIcon';
import Button from './Button';

const useStyles = makeStyles(() => ({
    alignCenter: {
        display: 'flex',
        alignItems: 'center'
    }
}));

export type Props = {
    name: string;
    category?: string;
    word?: string;
    isWordMaster: boolean;
};

export default function PlayerHeader({ name, category, word, isWordMaster }: Props) {
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

            {
                (isWordMaster && category && word) &&
                <Grid container item alignItems="center" xs={12} spacing={2}>
                    <Grid item>
                        <Label size="body2" kind="secondary">Categoria:</Label>
                    </Grid>

                    <Grid item>
                        <Button
                            kind="primary"
                            label={category}
                            backgroundColor="#FF0D0D"
                            hoverBgColor="#ff8e8e"
                            size="small"
                            width="7rem"
                        />
                    </Grid>

                    <Grid item>
                        <Label size="body2" kind="secondary">Palavra:</Label>
                    </Grid>

                    <Grid item>
                        <Button
                            kind="secondary"
                            label={word}
                            size="small"
                            width="7rem"
                        />
                    </Grid>
                </Grid>
            }
        </Grid>
    )
}
