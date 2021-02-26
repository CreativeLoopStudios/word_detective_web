import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    // warning
    // error
    // success
    info: {
      main: '#ff0d0c',
    },
    primary: {
      main: '#33c2ff',
    },
    secondary: {
      main: '#585475',
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