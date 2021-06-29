import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';

import Label from './Label';
import PlayerIcon from './PlayerIcon';
import Button from './Button';

import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    alignCenter: {
        display: 'flex',
        alignItems: 'center'
    }
}));

export type Props = {
    blueTitle?: string;
    title: string;
    category?: string;
    word?: string;
    isWordMaster: boolean;
};

export default function PlayerHeader({ blueTitle, title, category, word, isWordMaster }: Props) {
    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            <Grid item style={{ marginTop: 6 }}>
                <PlayerIcon isWordMaster={isWordMaster} />
            </Grid>
            <Grid item className={classes.alignCenter}>
                {
                    blueTitle &&
                    <>
                        <Label inline kind="primary" size="h4" bold>{blueTitle}</Label>
                        <Label inline kind="primary" size="h4" bold>&nbsp;</Label>
                    </>
                }
                <Label inline kind="secondary" size="h4" bold>{title}</Label>
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

PlayerHeader.propTypes = {
    blueTitle: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    word: PropTypes.string,
    isWordMaster: PropTypes.bool
};

PlayerHeader.defaultProps = {
    blueTitle: undefined,
    title: undefined,
    category: undefined,
    word: undefined,
    isWordMaster: false
};