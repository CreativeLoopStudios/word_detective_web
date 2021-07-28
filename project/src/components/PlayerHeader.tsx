import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';

import Label from './Label';
import PlayerIcon from './PlayerIcon';

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
    isWordMaster: boolean;
};

export default function PlayerHeader({ blueTitle, title, isWordMaster }: Props) {
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
        </Grid>
    )
}

PlayerHeader.propTypes = {
    blueTitle: PropTypes.string,
    title: PropTypes.string,
    isWordMaster: PropTypes.bool
};

PlayerHeader.defaultProps = {
    blueTitle: undefined,
    title: undefined,
    isWordMaster: false
};