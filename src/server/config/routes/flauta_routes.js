// myapp/server/routes.js
import R from 'ramda';
import path from 'path';

const flauta = require('flauta');

export const resolve = R.once(() => flauta.resolve([
  flauta.namespace({ path: '/', require: path.join(__dirname, 'controllers') }, [
    flauta.resources('users', { only: ['create', 'show', 'update'] }),

    flauta.namespace({ path: 'api/v1', require: 'api/v1' }, [
      flauta.resources('meals'),
      flauta.resources('recipes'),
    ]),
  ]),
]));

export const register = app => flauta.register(app, resolve());
