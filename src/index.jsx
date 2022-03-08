import {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {initContract} from "./services/near"
import { Buffer } from 'buffer'
import AuthContextProvider from "./context/authContext"

window.Buffer = window.Buffer || Buffer

initContract().then(() => {
  ReactDOM.render(
    <StrictMode>
      <AuthContextProvider>
        <App/>
      </AuthContextProvider>
    </StrictMode>,
    document.getElementById('root')
  )
})
