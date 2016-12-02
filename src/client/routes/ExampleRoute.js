import Relay from 'react-relay';

class ExampleRoute extends Relay.Route {
  static path = '/';
  static queries = {
    example: (Component) => Relay.QL`
      query {
        example {
          ${Component.getFragment('example')}
        }
      }
    `
  };
  static routeName = 'ExampleRoute';
}

export default ExampleRoute;
