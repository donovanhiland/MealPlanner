import React from 'react';
import Relay from 'react-relay';

/* global React, Relay */
class BoardApp extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        Boarding… {name}
      </div>
    );
  }
}

module.exports = BoardApp;

const BoardRelayContainer = Relay.createContainer(BoardApp, {
  fragments: {
    deal: () => Relay.QL`
      fragment on Deal {
        deal(id: 1) {
          comment
        }
      }
    `,
  },
});
