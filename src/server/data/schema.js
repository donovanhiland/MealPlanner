import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema
} from 'graphql';

import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions
} from 'graphql-relay';

const examples = [{
  id: 1,
  text: 'First Text',
  test: 'Test'
}, {
  id: 2,
  text: 'Second Text',
  test: 'Another Test'
}];

/**
 * The first argument defines the way to resolve an ID to its object (MODEL).
 * The second argument defines the way to resolve a node object to its GraphQL type.
 */
const {
  nodeInterface,
  nodeField
} = nodeDefinitions(
  (globalId) => {
    const {
      id,
      type
    } = fromGlobalId(globalId);
    if (type === 'Example') return examples[id];
    return null;
  },
  // obj => exampleType
  (obj) => {
    console.log(obj);
    return exampleType;
  }
);

// const { nodeInterface, nodeField } = nodeDefinitions(
//   (globalId) => {
//     const { type, id } = fromGlobalId(globalId);
//     if (type === 'User') {
//       return getUser(id);
//     } else if (type === 'Feature') {
//       return getFeature(id);
//     }
//     return null;
//   },
//   (obj) => {
//     if (obj instanceof User) {
//       return userType;
//     } else if (obj instanceof Feature) {
//       return featureType;
//     }
//     return null;
//   }
// );

const exampleType = new GraphQLObjectType({
  name: 'Example',
  fields: () => ({
    id: globalIdField('Example'),
    test: {
      type: GraphQLString,
      description: 'Hello World'
    },
    text: {
      type: GraphQLString,
    }
  }),
  interfaces: [nodeInterface]
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    example: {
      type: exampleType,
      resolve: (obj, args, ctx) => examples[1]
    }
  })
});

export const Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
