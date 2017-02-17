import React from 'react';

const App = props => (
  <div className="app-layout">
    Testasdf
    {props.children}
  </div>
);

App.propTypes = {
  children: React.PropTypes.any,
};

export default App;
