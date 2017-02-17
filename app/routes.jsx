import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import App from './views/app';
import Meatballs from './views/meatballs';
import Spaghetti from './views/spaghetti';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Meatballs} />
    <Route path="/spaghetti" component={Spaghetti} />
    <Redirect from="*" to="/" />
  </Route>
);
