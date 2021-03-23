import React from "react";
import { InputBase, Select as BaseSelect, Grid, makeStyles, withStyles, MenuItem } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
    root: {
        fontWeight: "bold",
        fontFamily: "gothic, sans-serif"
    },
    label: {
        color: 'white',
        fontFamily: "gothic, sans-serif",
        fontSize: '0.9rem',
        marginBottom: '1rem',
        textAlign: 'center'
    },
    options: {
        fontFamily: "gothic, sans-serif",
        fontSize: '0.9rem'
    }
}));

export type Props = {
    label?: string;
    options: Array<string>;
    onChange: () => void;
}

function Select({ label, options, onChange }: Props) {
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
                    paddingTop: '1rem'
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
                <BaseSelect
                    className={classes.root}
                    input={<CustomInput />}
                    onChange={onChange}
                    fullWidth
                >
                    {
                        options.map((op, index) => (
                            <MenuItem key={index} value={op} className={classes.options}>{op}</MenuItem>
                        ))
                    }
                </BaseSelect>
            </Grid>
        </Grid>
    );
};

Select.propTypes = {
    /**
     * What label text is shown, but if not provided, will not show label
     */
    label: PropTypes.string,
    /**
     * What type the input have
     */
    options: PropTypes.array,
    /**
     * Optional click handler
     */
    onChange: PropTypes.func,
};

Select.defaultProps = {
    label: undefined,
    options: [],
    onChange: undefined,
};

export default Select;