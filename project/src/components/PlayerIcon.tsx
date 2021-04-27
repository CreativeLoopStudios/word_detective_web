import { Grid, makeStyles } from '@material-ui/core';
import React from 'react'

import openBook from '../assets/open-book.png';
import detective from '../assets/detective.png';

import { Math } from "../utils"
import PropTypes from 'prop-types';

export const BackgroundColors = [
    '#0082D5',
    '#D5005F',
    '#73D500'
]

type StyleProps = {
    backgroundImage: string;
    backgroundColor: string;
    backgroundSize: string;
    backgroundPosition: string;
    border: string;
}

const useStyles = makeStyles({
    circle: ({ backgroundImage, backgroundColor, backgroundSize, backgroundPosition, border }: StyleProps) => ({
        backgroundColor: backgroundColor,
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: backgroundPosition,
        backgroundRepeat: 'no-repeat',
        backgroundSize: backgroundSize,
        borderRadius: 100,
        border: border,
        padding: '0.5rem',
        width: '1.8rem',
        height: '1.8rem'
    })
});

export type Props = {
    isWordMaster: boolean,
}

export default function PlayerIcon({ isWordMaster }: Props) {
    const classes = useStyles({
        backgroundImage: (isWordMaster) ? openBook : detective,
        backgroundColor: (isWordMaster) ? 'red' : BackgroundColors[Math.randomInt(0, 3)],
        backgroundSize: (isWordMaster) ? '1.8rem' : '2.5rem',
        backgroundPosition: (isWordMaster) ? 'center' : 'bottom',
        border: (isWordMaster) ? '2px solid yellow' : 'none',
    });

    return (
            <Grid item xs={3}>
                <div className={classes.circle}></div>
            </Grid>
    );
}

PlayerIcon.propTypes = {
    isWordMaster: PropTypes.bool,
};

PlayerIcon.defaultProps = {};