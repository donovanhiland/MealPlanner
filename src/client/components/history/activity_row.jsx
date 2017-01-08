class ActivityRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      trackable: props.activity.trackable,
      owner: props.activity.owner,
      iconName: props.iconName(props.activity)
    };
    this.toggleControls = this.toggleControls.bind(this);
  }

  toggleControls() {
    dispatcherRegistry.dispatch("_TOGGLE_ACTIVITY_CONTROL_", !this.refs.activityContent.state.showControls);
    this.refs.activityContent.setState({
      showControls: !this.refs.activityContent.state.showControls
    });
  }

  render() {
    return (
      <div>
        <div className="col-xs-12 p-x-0 history-row">
          <ActivityConnect isLast={this.props.isLast}>
            <TimelineIcon iconName={this.state.iconName}/>
          </ActivityConnect>
          <div className='activity-card col-xs-11'>
            <ActivityHeader currentUser={this.props.currentUser} activity={this.props.activity} onClick={this.toggleControls} clickable={this.props.activity.key !== 'task.completed'}/>
            <div className="history-divider"></div>
            {this.state.trackable && <ActivityContent ref="activityContent" trackable={this.state.trackable} type={this.props.activity.trackable_type} showControls={this.state.showControls}/>}
          </div>
        </div>
        {!this.props.isLast && <HistorySpacer/>}
      </div>
    )
  }
}

ActivityRow.propTypes = {
  activity: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired,
  isLast: React.PropTypes.bool
};

ActivityRow.defaultProps = {
  iconName: activity => {
    switch (activity.key) {
      case 'phone_call.create':
        return 'phone';
        break;
      case 'email.create':
        return 'email';
        break;
      case 'deal_update.create':
        return 'subject';
        break;
      case 'meeting.create':
        return 'date_range';
        break;
      case 'task.completed':
        return 'check';
        break;
      default:
        console.error('Unknown key type ' + activity.key);
        return 'subject';
        break;
    }
  }
}
