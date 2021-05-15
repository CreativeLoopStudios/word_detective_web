import React, { ChangeEvent, KeyboardEvent, Ref } from "react";
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
    className?: string;
    type: 'text' | 'password' | 'number';
    value: string | number;
    inputRef?: Ref<any>;
    helperText?: string;
    error?: boolean;
    onChange: (text: string) => void;
    onKeyDown?: (key: string) => void;
}

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

function Input({ label, placeholder, className, type, value, inputRef, helperText, error, onChange, onKeyDown }: Props) {
    const classes = useStyles();

    return (
        <Grid container direction="column" className={className}>
            {
                label &&
                <Grid item xs={12} className={classes.label} id="label__div">
                    <label htmlFor="input">{label}</label>
                </Grid>
            }
            <Grid item xs={12}>
                <CustomInput
                    id="input"
                    inputRef={inputRef}
                    className={classes.root}
                    placeholder={placeholder}
                    type={type}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
                    onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => onKeyDown && onKeyDown(event.key)}
                    value={value}
                    fullWidth
                    error={error}
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    helperText: PropTypes.string,
    error: PropTypes.bool,
    /**
     * Optional click handler
     */
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func
};

Input.defaultProps = {
    label: undefined,
    placeholder: undefined,
    type: "text",
    value: undefined,
    helperText: "",
    error: false,
    onChange: undefined,
    onKeyDown: undefined
};

export default Input;