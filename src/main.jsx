import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {AuthContextProvider} from './Contexts/AuthContext.jsx'

const theme = createTheme();



ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <AuthContextProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AuthContextProvider>
    </ThemeProvider>

  </>,
)
