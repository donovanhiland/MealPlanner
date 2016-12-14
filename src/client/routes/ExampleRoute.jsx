/* eslint-disable all */
import Relay from 'react-relay';

// RelayQueryRoots or RelayQueryConfig
// class ExampleRoute extends Relay.Route {
//   static path = '/';
//   static queries = {
//     example: (Component) => Relay.QL`
//       query {
//         example {
//           ${Component.getFragment('example')}
//         }
//       }
//     `
//   };
//   // static paramDefinitions = {
//   //   exampleID: { required: true },
//   // };
//   static routeName = 'ExampleRoute';
// }

class ExampleRoute extends Relay.Route {
  static path = '/';
  static queries = {
    example: (Component) => Relay.QL`
      query {
        deal {
          notes {
            text
          }
        }
      }
    `
  };
  // static paramDefinitions = {
  //   exampleID: { required: true },
  // };
  static routeName = 'ExampleRoute';
}

export default ExampleRoute;
