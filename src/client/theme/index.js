import { createMuiTheme } from '@material-ui/core/styles';
import color from 'color';
import red from '@material-ui/core/colors/red';
import blueGrey from '@material-ui/core/colors/blueGrey';
import amber from '@material-ui/core/colors/amber';

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'light',
    primary: { main: red[900] },
    secondary: { main: blueGrey[700] },
    error: {
      main: '#f44336',
      hover: color('#f44336').darken(0.3).toString(),
      hoverBright: color('#f44336').fade(0.92).string()
    },
    warning: {
      main: amber[700]
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3.5,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  zIndex: {
    root: 1,
    stickyHeader: 10,
    fab: 100,
    dropdown: 110
  },
});
