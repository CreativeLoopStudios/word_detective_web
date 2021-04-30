import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, makeStyles } from "@material-ui/core";

export type Props = {
    value: number;
    max: number;
    color?: string;
}

type StyleProps = {
    color: string,
}

const useStyles = makeStyles(() => ({
    root: {
        fontFamily: 'gothic, sans-serif',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: 'white',
    },
    progress: ({ color }: StyleProps) => ({
        color,
    })
}));

function Timer({ value, max, color }: Props) {
    const classes = useStyles({ color: color || '#FF0D0D' });

    if (value > max) {
        value = max;
    } else if (value < 0) {
        value = 0;
    }

    const timerVal = value * 100 / max;

    return (
    <Box position="relative" display="inline-flex">
        <CircularProgress className={classes.progress} variant="determinate" value={timerVal} size={90} thickness={7} />
        <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        >
            <span className={classes.root}>{value}</span>
        </Box>
    </Box>
    );
}

Timer.propTypes = {
    /**
     * The current value of the timer.
     */
    value: PropTypes.number.isRequired,

    /**
     * The max value of the timer.
     */
    max: PropTypes.number.isRequired,

    /**
     * Progress color.
     */
    color: PropTypes.string,
};

export default Timer;