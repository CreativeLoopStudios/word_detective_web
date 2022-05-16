import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    type: 'dark',
    // warning
    // error
    // success
    info: {
      main: '#ff0d0c',
      light: '#ff1e1d',
    },
    primary: {
      main: '#33c2ff',
      light: '#44d3ff',
    },
    secondary: {
      main: '#585475',
      light: '#696586',
    },
    text: {
      primary: '#eeeeee',
      secondary:'#eeeeee', 
    },
    background: {
      default: '#333333'
    },
    divider: '#eeeeee',
  },
});

export default theme;