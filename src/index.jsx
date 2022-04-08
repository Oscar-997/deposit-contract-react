import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import { initContract } from "./services/near"
import { Buffer } from 'buffer'
import AuthContextProvider from "./context/authContext"
import TokenDataContext from './context/TokenResultsContext';

window.Buffer = window.Buffer || Buffer

initContract().then(() => {
  ReactDOM.render(

    <AuthContextProvider>
      <TokenDataContext>
        <Router>
          <App />
        </Router>
      </TokenDataContext>
    </AuthContextProvider>
    ,
    document.getElementById('root')
  )
})
