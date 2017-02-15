import React from 'react';

const App = props => (
  <div className="app-layout">
    {props.children}
  </div>
);

App.propTypes = {
  children: React.PropTypes.any,
};

export default App;
