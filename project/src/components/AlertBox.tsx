import React from 'react';

import { Grid, makeStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

import alert from '../assets/alert.png';
import Label from './Label';

const useStyles = makeStyles(() => ({
    img: {
        height: '2rem'
    }
}));

export type Props = {
    label: string;
}

function AlertBox({ label }: Props) {
    const classes = useStyles();
    
    return (
        <Grid container item spacing={0} alignItems="center">
            <Grid item xs={1}>
                <img src={alert} alt="box de alerta" className={classes.img} />
            </Grid>

            <Grid item xs={11}>
                <Label color="#FF8484">
                    {label}
                </Label>
            </Grid>
        </Grid>
    );
}

AlertBox.propTypes = {
    label: PropTypes.string
};
AlertBox.defaultProps = {
    label: undefined
};

export default AlertBox;