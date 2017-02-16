import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import App from './views/app';
import Home from './views/home';
import About from './views/about';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/about" component={About} />
    <Redirect from="*" to="/" />
  </Route>
);
