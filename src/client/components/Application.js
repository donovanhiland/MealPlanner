import React from 'react';

export default class Application extends React.Component {
  render() {
    return (
      <div>
        test
        { this.props.example.text }
        { this.props.example.id }
      </div>
    );
  }
}
