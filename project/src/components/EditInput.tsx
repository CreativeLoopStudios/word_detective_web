import React, { ChangeEvent, useState } from "react";

import { Theme, InputBase, Grid, makeStyles, withStyles, IconButton, TextField } from "@material-ui/core";
import { Edit as EditIcon, Check as CheckIcon } from '@material-ui/icons';

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
        textAlign: 'left'
    },
    icon: {
        color: 'white'
    }
}));

export type Props = {
    label?: string;
    placeholder?: string;
    type: 'text' | 'password' | 'number';
    value: string;
    onFinishEditing: (text: string) => void;
}

const CustomInput = withStyles(({ palette }: Theme) => {
    return {
        root: {
            "& .MuiInputBase-input": {
                borderRadius: 30,
                height: "0.5rem",
                color: palette["primary"].main,
                fontWeight: 'bold'
            },
        },
    };
})(InputBase);

function EditInput({ label, placeholder, type, value, onFinishEditing }: Props) {
    const classes = useStyles();

    const [inputValue, setInputValue] = useState<string>(value);
    const [isReadOnly, setReadOnly] = useState<boolean>(true);

    function handleEdit(): void {
        setReadOnly(false);
    }

    function handleFinishEditing(): void {
        setReadOnly(true);
        onFinishEditing(inputValue);
    }

    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                {
                    label &&
                    <div className={classes.label}>
                        <label htmlFor="input">{label}</label>
                    </div>
                }
                <Grid item container>
                    <Grid item xs={11}>
                        <CustomInput
                            id="input"
                            className={classes.root}
                            placeholder={placeholder}
                            type={type}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)}
                            value={inputValue}
                            fullWidth
                            readOnly={isReadOnly}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        {
                            isReadOnly &&
                            <IconButton onClick={handleEdit}>
                                <EditIcon className={classes.icon} />
                            </IconButton>
                        }
                        {
                            !isReadOnly &&
                            <IconButton onClick={handleFinishEditing}>
                                <CheckIcon className={classes.icon} />
                            </IconButton>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

EditInput.propTypes = {
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
     * On Finish Editing
     */
    onFinishEditing: PropTypes.func
};

EditInput.defaultProps = {
    label: undefined,
    placeholder: undefined,
    type: "text",
    value: undefined,
    onFinishEditing: undefined
};

export default EditInput;