class TimelineIcon extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="history-connect-step-content">
        <i className="material-icons timeline-icon">{this.props.iconName}</i>
      </div>
    )
  }
}

TimelineIcon.propTypes = {
  iconName: React.PropTypes.string
};

TimelineIcon.defaultProps = {
  iconName: 'subject'
}
