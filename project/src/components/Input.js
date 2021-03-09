import React from "react";
import { InputBase, Grid, makeStyles, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: {
        fontWeight: "bold",
        fontFamily: "gothic, sans-serif",
    },
    label: {
        color: 'white',
        fontFamily: "gothic, sans-serif",
        fontSize: '0.9rem',
        marginBottom: '1rem'
    }
}));

/**
 * Primary UI component for user interaction
 */
export const Input = ({ label, placeholder, type, onChange, ...props }) => {
    const classes = useStyles();
    const CustomInput = withStyles((theme) => {
        return {
            root: {
                "& .MuiInputBase-input": {
                    borderRadius: 30,
                    height: "2rem",
                    textAlign: "center",
                    background: "#E3E3E3 0% 0% no-repeat padding-box",
                },
            },
        };
    })(InputBase);

    return (
        <>
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
                        {...props}
                    />
                </Grid>
            </Grid>
        </>
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
    /**
     * Optional click handler
     */
    onChange: PropTypes.func,
};

Input.defaultProps = {
    label: undefined,
    placeholder: undefined,
    type: "text",
    onChange: undefined,
};