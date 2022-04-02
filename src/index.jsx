import {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import App from './App';
import {initContract} from "./services/near"
import { Buffer } from 'buffer'
import AuthContextProvider from "./context/authContext"
import TokenRs from "./context/TokenResultsContext"

window.Buffer = window.Buffer || Buffer

initContract().then(() => {
  ReactDOM.render(
    <StrictMode>
      <AuthContextProvider>
        <TokenRs>
          <Router>
            <App/>
          </Router>
        </TokenRs>
      </AuthContextProvider>
    </StrictMode>,
    document.getElementById('root')
  )
})
