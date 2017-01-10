import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';

import Route from './routes';

ReactDOM.render(
  <Router
    history={browserHistory}
    routes={Route}
  />,
  document.getElementById('root')
);
