import Relay from 'react-relay';
import Application from '../components/Application.jsx';

export default Relay.createContainer(Application, {
  fragments: {
    // 'example' below is arbitrary. It's accessed in the component on this.props.example. 'Example' is referenced in schema.js in node interface and evalutated based on: `fragment on [what's placed here]`
    example: () => Relay.QL`
      fragment on Example {
        text,
        test,
        id
      }
    `
  }
});
