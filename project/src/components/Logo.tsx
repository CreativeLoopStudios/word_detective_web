import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import logo from '../assets/logo.png';

export type LogoProps = {
    variant?: 'round',
    color?: string,
    size?: 'small' | 'medium' | 'large',
}

export const Sizes = {
    small: 60,
    medium: 100,
    large: 150,
}

type StyleProps = {
    color: string,
    size: number,
}


const useStyles = makeStyles(() => ({
    root: ({ size }: StyleProps) => ({
        display: 'inline-block',
        position: 'relative',
        width: size,
        height: size,
        overflow: 'hidden',
        borderRadius: '50%',
        padding: size,
    }),
    rootColor: ({ color }: StyleProps) => ({
        backgroundColor: color,
    }),
    img: ({ size }) => ({
        width: 'auto',
        height: '100%',
        marginLeft: -size / 2 - size / 10,
    })
}))

function Logo({ variant, color, size }: LogoProps) {
    const classes = useStyles({ color: color || 'black', 
                                size: Sizes[size || 'medium'] });

    return (
        <div className={`${classes.root} ${classes.rootColor}`}>
            <img alt="Word Detective" src={logo} className={classes.img} />
        </div>
    )
}

Logo.propTypes = {
    variant: PropTypes.oneOf(['round']),
    color: PropTypes.string,
    size: PropTypes.oneOf(Object.keys(Sizes)),
};

Logo.defaultProps = {
    variant: 'round',
    color: 'black',
    size: 'medium',
};

export default Logo;