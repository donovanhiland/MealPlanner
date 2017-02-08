import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

const Page = '<div>Test</div>';

export default (
  <Route path="/" component={Page}>
    <IndexRoute component={Page} />
    <Route path="/signup" component={Page} />
    <Route path="/login" component={Page} />
    <Redirect from="*" to="/" />
  </Route>
);
