class ActivityControlsBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="history-divider"></div>

        <div className="history-controls-bar">
          {this.props.children}
        </div>
      </div>
    )
  }
}
