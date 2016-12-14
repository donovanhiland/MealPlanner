import React from 'react';

export default class Application extends React.Component {
  render() {
    return (
      <div>
        { this.props.example.test }
        <br />
        { this.props.example.text }
        <br />
        { this.props.example.id }
      </div>
    );
  }
}
