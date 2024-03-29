import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import logo from '../assets/logo.png';

export type LogoProps = {
    variant?: 'round' | 'rect',
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
    borderRadius: string,
    horizontalPadding: number,
    verticalPadding: number,
}


const useStyles = makeStyles(() => ({
    root: ({ size, borderRadius, horizontalPadding, verticalPadding }: StyleProps) => ({
        display: 'inline-block',
        position: 'relative',
        width: size,
        height: size,
        overflow: 'hidden',
        borderRadius,
        padding: `${verticalPadding}px ${horizontalPadding}px ${verticalPadding}px ${horizontalPadding}px`,
        boxSizing: 'content-box',
    }),
    rootColor: ({ color }: StyleProps) => ({
        backgroundColor: color,
    }),
    img: ({ size }: StyleProps) => ({
        width: 'auto',
        height: '100%',
        marginLeft: -size / 2 - size / 10,
    })
}))

function Logo({ variant, color, size }: LogoProps) {
    const pixelSize = Sizes[size || 'medium'];
    const classes = useStyles({color: color || 'black', 
                               size: pixelSize, 
                               borderRadius: variant === 'round' ? '50%' : '0',
                               horizontalPadding: pixelSize,
                               verticalPadding: pixelSize / (variant === 'rect' ? 2 : 1),
                             });

    return (
        <div className={`${classes.root} ${classes.rootColor}`}>
            <img alt="Word Detective" src={logo} className={classes.img} />
        </div>
    )
}

Logo.propTypes = {
    variant: PropTypes.oneOf(['round', 'rect']),
    color: PropTypes.string,
    size: PropTypes.oneOf(Object.keys(Sizes)),
};

Logo.defaultProps = {
    variant: 'round',
    color: 'black',
    size: 'medium',
};

export default Logo;