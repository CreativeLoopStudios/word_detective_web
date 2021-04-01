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
  hoverColor?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick: (event: MouseEvent) => void;
};

/**
 * Primary UI component for user interaction
 */
function Button({ kind, variant, backgroundColor, hoverColor, size, label, onClick }: Props) {
  const classes = useStyles();

  const CustomButton = withStyles(({ palette }: Theme) => {
    const mainColor: string = backgroundColor || palette[kind].main;
    const bg: string = variant === "contained" ?  mainColor : '';
    const hc: string = hoverColor || palette[kind].light;
    return {
      root: {
        borderColor: mainColor,
        backgroundColor: bg,
        color: variant === "contained" ? palette.getContrastText(bg) : mainColor,
        '&:hover': {
          backgroundColor: hc,
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
   * What background color to use when hovering
   */
  hoverColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  kind: 'primary',
  backgroundColor: null,
  hoverColor: undefined,
  size: 'medium',
  onClick: undefined,
  variant: 'contained',
};

export default Button;