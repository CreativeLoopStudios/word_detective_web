import React from "react";

import { FormControlLabel, Checkbox as BaseCheckbox, makeStyles } from "@material-ui/core";

import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
    root: {
        '& span': {
            color: '#00FF8A',
            fontWeight: "bold",
            fontFamily: "gothic, sans-serif",
        },
        '& .MuiIconButton-label': {
            color: 'white'
        }
    }
}));

export type Props = {
    label: string;
    onChange: () => void;
}

function Checkbox({ label, onChange }: Props) {
    const classes = useStyles();

    return (
        <FormControlLabel
            className={classes.root}
            control={
                <BaseCheckbox
                    onChange={onChange}
                />
            }
            label={label}
        />
    );
};

Checkbox.propTypes = {
    /**
     * What label text is shown, but if not provided, will not show label
     */
    label: PropTypes.string,
    /**
     * Optional click handler
     */
    onChange: PropTypes.func,
};

Checkbox.defaultProps = {
    label: undefined,
    onChange: undefined,
};

export default Checkbox;