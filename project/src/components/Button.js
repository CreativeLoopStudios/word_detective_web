import React from 'react';
import { Button as MuiButton, makeStyles, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '2rem',
    fontWeight: 'bold',
    padding: '1.1rem',
    fontFamily: 'gothic, sans-serif',
    borderWidth: '.2rem',
  },
}));

/**
 * Primary UI component for user interaction
 */
export const Button = ({ kind, variant, backgroundColor, hoverColor, size, label, ...props }) => {
  const CustomButton = withStyles(theme => {
    const mainColor = backgroundColor || theme.palette[kind].main;
    const bg = variant === "contained" ?  mainColor : undefined;
    const hc = hoverColor || theme.palette[kind].light;
    return {
      root: {
        borderColor: mainColor,
        backgroundColor: bg,
        color: variant === "contained" ? theme.palette.getContrastText(bg) : mainColor,
        '&:hover': {
          backgroundColor: hc,
        },
      }
    }
  })(MuiButton);

  const classes = useStyles();
  return (
    <CustomButton
      variant={variant}
      disableElevation
      size={size}
      className={classes.root}
      {...props}
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
