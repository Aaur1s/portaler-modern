import { createTheme } from '@material-ui/core/styles'

const theme = createTheme({
  typography: {
    fontFamily: 'Lato, sans-serif',
  },
  palette: {
    background: {
      default: '#333',
    },
    primary: {
      main: '#aa00ff',
    },
    secondary: {
      main: '#fdd835',
    },
    type: 'dark',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          background: '#333',
        },
        body: {
          background: '#333',
        },
      },
    },
  },
})

export default theme
