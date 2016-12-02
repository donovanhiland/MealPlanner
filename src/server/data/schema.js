

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

const example = {
  id: 1,
  text: 'Test'
};

/**
 * The first argument defines the way to resolve an ID to its object.
 * The second argument defines the way to resolve a node object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { id, type } = fromGlobalId(globalId);
    if (type === 'Example') return example;
    return null;
  },
  obj => exampleType
);

const exampleType = new GraphQLObjectType({
  name: 'Example5',
  fields: () => ({
    id: globalIdField('Example'),
    text: {
      type: GraphQLString,
      description: 'Hello World'
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
      resolve: () => example
    }
  })
});

export const Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
