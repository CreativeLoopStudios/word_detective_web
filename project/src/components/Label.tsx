import React from 'react';

import { Typography, makeStyles, withStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    root: {
        fontFamily: 'gothic, sans-serif'
    }
}));

export type Props = {
    color?: string;
    bold?: boolean;
    kind: 'primary' | 'secondary';
    size?: 'subtitle1' | 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    inline?: boolean;
    underline?: boolean;
    italic?: boolean;
    children: React.ReactNode;
}

function Label({ kind, color, bold, size, inline, underline, italic, children }: Props) {
    const classes = useStyles();

    const CustomTypography = withStyles(() => {
        let textColor: string | undefined;
        switch (kind) {
            case 'primary':
                textColor = '#34C1FF';
                break;
            case 'secondary':
                textColor = '#ffffff';
                break;
        }
        return {
            root: {
                color: color || textColor,
                fontWeight: bold ? 'bold' : 'normal',
                fontStyle: italic ? 'italic' : 'normal',
                textDecoration: underline ? 'underline' : 'normal',
                display: inline ? 'inline-block' : null
            }
        }
    })(Typography);

    return (
        <CustomTypography
            variant={size}
            className={classes.root}>
            {children}
        </CustomTypography>
    );
}

Label.propTypes = {
    color: PropTypes.string,
    bold: PropTypes.bool,
    kind: PropTypes.string,
    size: PropTypes.string,
    inline: PropTypes.bool,
    underline: PropTypes.bool,
    italic: PropTypes.bool,
};
Label.defaultProps = {
    color: null,
    bold: false,
    kind: 'primary',
    size: 'body1',
    inline: false,
    underline: false,
    italic: false
};

export default Label;