import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core'
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '3rem',
    fontWeight: 'bold'
  },
}));

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, backgroundColor, size, label, ...props }) => {
  const classes = useStyles();
  return (
    <MuiButton
      variant="contained"
      disableElevation
      size={size || "medium"}
      color={backgroundColor || "secondary"}
      className={classes.root}
      {...props}
    >
      {label}
    </MuiButton>
  );
};

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
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
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
};
