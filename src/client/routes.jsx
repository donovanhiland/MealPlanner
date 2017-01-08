import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

export default (
  <Route path='/' component={}>
    <IndexRoute component={} />
    <Route path='/signup' component={} />
    <Route path='/login' component={} />
    <Redirect from='*' to='/' />
  </Route>
);
