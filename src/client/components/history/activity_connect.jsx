class ActivityConnect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      isLast: props.isLast
    };
  }

  render() {
    return (
      <div className="history-connect-step col-xs-1">
        <div className="history-connect-step-pre-line"></div>

        {this.props.children}

        <div className={this.props.isLast
          ? 'history-connect-step-post-line last-post-line'
          : 'history-connect-step-post-line'}></div>
      </div>
    )
  }
}

ActivityConnect.propTypes = {
  type: React.PropTypes.string,
  isLast: React.PropTypes.bool
};

ActivityConnect.defaultProps = {
  type: 'update',
  isLast: false
}
