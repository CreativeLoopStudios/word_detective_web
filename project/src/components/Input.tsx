import React, { ChangeEvent } from "react";
import { InputBase, Grid, makeStyles, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
    root: {
        fontWeight: "bold",
        fontFamily: "gothic, sans-serif",
        '& input[type=number]': {
            paddingRight: '1rem'
        }
    },
    label: {
        color: 'white',
        fontFamily: "gothic, sans-serif",
        fontSize: '0.9rem',
        marginBottom: '1rem',
        textAlign: 'center'
    }
}));

export type Props = {
    label?: string;
    placeholder?: string;
    type: 'text' | 'password' | 'number';
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Input({ label, placeholder, type, value, onChange }: Props) {
    const classes = useStyles();
    const CustomInput = withStyles(() => {
        return {
            root: {
                "& .MuiInputBase-input": {
                    borderRadius: 30,
                    height: "2rem",
                    color: 'black',
                    textAlign: "center",
                    background: "#E3E3E3 0% 0% no-repeat padding-box",
                },
            },
        };
    })(InputBase);

    return (
        <Grid container direction="column">
            {
                label &&
                <Grid item xs={12} className={classes.label}>
                    <label htmlFor="input">{label}</label>
                </Grid>
            }
            <Grid item xs={12}>
                <CustomInput
                    id="input"
                    className={classes.root}
                    placeholder={placeholder}
                    type={type}
                    onChange={onChange}
                    value={value}
                    fullWidth
                />
            </Grid>
        </Grid>
    );
};

Input.propTypes = {
    /**
     * What label text is shown, but if not provided, will not show label
     */
    label: PropTypes.string,
    /**
     * What placeholder of the input
     */
    placeholder: PropTypes.string,
    /**
     * What type the input have
     */
    type: PropTypes.oneOf(["text", "password", "number"]),
    value: PropTypes.string,
    /**
     * Optional click handler
     */
    onChange: PropTypes.func,
};

Input.defaultProps = {
    label: undefined,
    placeholder: undefined,
    type: "text",
    value: undefined,
    onChange: undefined,
};

export default Input;