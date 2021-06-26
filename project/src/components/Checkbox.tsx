import React, { ChangeEvent } from "react";

import { FormControlLabel, Checkbox as BaseCheckbox, makeStyles } from "@material-ui/core";

import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
    root: {
        '& span': {
            color: 'white',
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
    checked: boolean;
    value: string | number;
    onChange: (value: string, checked: boolean) => void;
}

function Checkbox({ label, checked, value, onChange }: Props) {
    const classes = useStyles();

    return (
        <FormControlLabel
            className={classes.root}
            control={
                <BaseCheckbox
                    checked={checked}
                    value={value}
                    onChange={(evt: ChangeEvent<HTMLInputElement>) => onChange(evt.target.value, evt.target.checked)}
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
    checked: PropTypes.bool,
    value:  PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Optional click handler
     */
    onChange: PropTypes.func,
};

Checkbox.defaultProps = {
    label: undefined,
    checked: false,
    value: undefined,
    onChange: undefined,
};

export default Checkbox;