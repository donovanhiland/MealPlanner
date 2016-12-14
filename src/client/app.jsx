import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import ExampleRoute from './routes/ExampleRoute.jsx';
import Application from './containers/Application.jsx';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:9000/graphql')
);

class Root extends React.Component {
  render() {
    return (
      <Relay.RootContainer
        Component={Application}
        route={new ExampleRoute()}
      />
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

// ReactDOM.render(
//   <div>Hello</div>,
//   document.getElementById('root')
// );
