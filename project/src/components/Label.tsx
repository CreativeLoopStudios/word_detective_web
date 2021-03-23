import React from 'react';

import { Typography, makeStyles, Theme, withStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

const useTypes = makeStyles(() => ({
    root: {
        fontFamily: 'gothic, sans-serif'
    }
}));

export type Props = {
    color?: string;
    bold?: boolean;
    kind: 'primary' | 'secondary';
    size?: 'subtitle1' | 'body1' | 'body2' | 'h1' | 'h2' | 'h3';
    children: React.ReactNode;
}

function Label({ kind, color, bold, size, children }: Props) {
    const classes = useTypes();

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
            fontWeight: bold ? 'bold' : 'normal'
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
    size: PropTypes.string
};
Label.defaultProps = {
    color: null,
    bold: false,
    kind: 'primary',
    size: 'body1'
};

export default Label;