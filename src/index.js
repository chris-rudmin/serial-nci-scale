import React from 'react';
import ReactDOM from 'react-dom';
import './example/index.css';
import App from './example/App';
import reportWebVitals from './example/reportWebVitals';
import CssBaseline from '@material-ui/core/CssBaseline';


ReactDOM.render(
  <React.StrictMode>
    <CssBaseline>
      <App />
    </CssBaseline>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
