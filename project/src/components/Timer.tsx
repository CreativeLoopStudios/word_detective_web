import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import { useCountdown } from '../hooks';

export type Props = {
    max: number;
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

function Timer({ max, color, onExpire }: Props) {
    const classes = useStyles({ color: color || '#FF0D0D' });
    const { countdown, start, stop } = useCountdown(200);

    useEffect(() => {
        return () => {
            console.log('stopping');
            stop();
        };
    }, [stop]);

    useEffect(() => {
        if (max > 0) {
            console.log('starting timer');
            const onExpire_ = () => {
                console.log('calling expire');
                if (onExpire) {
                    onExpire();
                }
            }
            start(max, onExpire_ || (() => {}));
        }
    }, [max, start, onExpire]);

    let timerVal = countdown * 100 / max;
    timerVal = timerVal < 0.5 ? 0 : parseFloat(timerVal.toPrecision(3));

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
            <span className={classes.root}>{Math.round(countdown)}</span>
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
};

export default Timer;