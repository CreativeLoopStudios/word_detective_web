import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import { useCountdown } from '../hooks';

export type Props = {
    max: number;
    key: any;
    color?: string;
    onExpire?: () => void;
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

function Timer({ max, color, onExpire, key }: Props) {
    const classes = useStyles({ color: color || '#FF0D0D' });
    const { countdown, start, stop } = useCountdown();
    const [key_, setKey] = useState(0);

    if (key !== key_ && key !== 0) {
        stop();
    }
    if (key !== key_ && max > 0) {
        start(max, onExpire || (() => {}));
        setKey(key);
    }

    const timerVal = countdown * 100 / max;
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
            <span className={classes.root}>{countdown}</span>
        </Box>
    </Box>
    );
}

Timer.propTypes = {
    /**
     * The max value of the timer.
     */
    max: PropTypes.number.isRequired,

    /**
     * Progress color.
     */
    color: PropTypes.string,


    /**
     * Called when expired.
     */
    onExpire: PropTypes.func,

    /**
     * Change this to force reseting the timer.
     */
    key: PropTypes.any,
};

export default Timer;