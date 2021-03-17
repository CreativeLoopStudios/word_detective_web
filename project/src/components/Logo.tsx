import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../assets/logo.png';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    root: {
        display: 'inline-block',
        position: 'relative',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
        borderRadius: '50%',
        backgroundColor: 'black',
        padding: '100px'
    },
    img: {
        width: 'auto',
        height: '100%',
        marginLeft: '-60px'
    }
}))

export type Props = {
    variant?: 'round',
}

function Logo({ variant }: Props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <img alt="Word Detective" src={logo} className={classes.img} />
        </div>
    )
}

Logo.propTypes = {
    variant: PropTypes.oneOf(['round']),
};
Logo.defaultProps = {
    variant: 'round',
};

export default Logo;