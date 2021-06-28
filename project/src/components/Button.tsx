import React, { MouseEvent } from 'react';

import { Button as MuiButton, makeStyles, Theme, withStyles } from '@material-ui/core'

import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: '2rem',
    fontWeight: 'bold',
    padding: '0.5rem 2rem',
    fontFamily: 'gothic, sans-serif',
    borderWidth: '.2rem',
  },
}));

export type Props = {
  kind: 'primary' | 'secondary' | 'info';
  variant?: 'contained' | 'outlined';
  backgroundColor?: string;
  hoverBgColor?: string;
  width?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  color?: string;
  hoverColor?: string;
};

/**
 * Primary UI component for user interaction
 */
function Button({ kind, variant, backgroundColor, hoverBgColor, width, size, label, disabled, onClick, color, hoverColor }: Props) {
  const classes = useStyles();

  const CustomButton = withStyles(({ palette }: Theme) => {
    const mainColor: string = backgroundColor || palette[kind].main;
    const bg: string = variant === "contained" ?  mainColor : '';
    const hbgc: string = hoverBgColor || palette[kind].light;
    color = color || (variant === "contained" ? palette.getContrastText(bg) : mainColor);
    return {
      root: {
        borderColor: mainColor,
        backgroundColor: bg,
        color,
        width,
        '&:hover': {
          backgroundColor: hbgc,
          color: hoverColor || color,
        },
      }
    }
  })(MuiButton);

  return (
    <CustomButton
      variant={variant}
      disableElevation
      size={size}
      className={classes.root}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </CustomButton>
  );
};

Button.propTypes = {
  /**
   * The button color style
   */
  kind: PropTypes.oneOf(['primary', 'secondary', 'info']),
  /**
   * The button variant style
   */
  variant: PropTypes.oneOf(['contained', 'outlined']),
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * What color to use
   */
  color: PropTypes.string,
  /**
   * What background color to use when hovering
   */
  hoverBgColor: PropTypes.string,
  /**
   * What color to use when hovering
   */
  hoverColor: PropTypes.string,
  /**
   * Button width
   */
  width: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * If Button is disabled
   */
  disabled: PropTypes.bool,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  kind: 'primary',
  backgroundColor: null,
  color: undefined,
  hoverBgColor: undefined,
  hoverColor: undefined,
  width: undefined,
  size: 'medium',
  disabled: false,
  onClick: undefined,
  variant: 'contained',
};

export default Button;