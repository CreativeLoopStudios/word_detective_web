import React from 'react';

import { makeStyles } from '@material-ui/core'

import background from '../assets/background.png';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    background: 'radial-gradient(circle, rgba(0,108,133,1) 0%, rgba(0,35,43,1) 100%)'
  },
  background: {
    height: '100vh',
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflow: 'auto'
  },
}));

function Background({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.background}>
        {children}
      </div>
    </div>
  );
};

export default Background;