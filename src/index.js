import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SinglePolygon from './components/SinglePolygon';
import SummaryPolygon from './components/SummaryPolygon';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

const appExports = {
  SinglePolygon,
  SummaryPolygon
}

export default appExports;