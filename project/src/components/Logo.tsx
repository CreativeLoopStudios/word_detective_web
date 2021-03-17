import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import logo from '../assets/logo.png';

type StyleProps = {
    color: string,
}

const useStyles = makeStyles(() => ({
    root: {
        display: 'inline-block',
        position: 'relative',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
        borderRadius: '50%',
        padding: '100px'
    },
    rootColor: ({ color }: StyleProps) => ({
        backgroundColor: color,
    }),
    img: {
        width: 'auto',
        height: '100%',
        marginLeft: '-60px'
    }
}))

export type LogoProps = {
    variant?: 'round',
    color?: string,
}

function Logo({ variant, color }: LogoProps) {
    const classes = useStyles({ color: color || 'black' });

    return (
        <div className={`${classes.root} ${classes.rootColor}`}>
            <img alt="Word Detective" src={logo} className={classes.img} />
        </div>
    )
}

Logo.propTypes = {
    variant: PropTypes.oneOf(['round']),
    color: PropTypes.string,
};
Logo.defaultProps = {
    variant: 'round',
    color: 'black',
};

export default Logo;