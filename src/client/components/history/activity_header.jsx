class ActivityHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: ''
    }
    this.dateString = this.dateString.bind(this);
  }

  componentDidMount() {
    this.setState({title: this.displayTitle()});
  }

  displayTitle() {
    var activity = this.props.activity;
    currentUser = this.props.currentUser;
    actor = `${currentUser.id === activity.owner.id
      ? 'You'
      : activity.owner.first_name + ' ' + activity.owner.last_name}`
    switch (activity.trackable_type) {
      case 'PhoneCall':
        return `${actor} made a phone call`;
        break;
      case 'Email':
        return `${actor} sent an email`;
        break;
      case 'DealUpdate':
        return `${actor} added an update`;
        break;
      case 'Meeting':
        return `${actor} had a meeting`;
        break;
      case 'Task':
        return `${actor} completed a task`;
        break;
      default:
        console.error(`Unknown activity type: ${activity.trackable_type}`);
        return 'Unknown activity was performed';
    }
  }

  dateString() {
    return moment(this.props.activity.created_at).format("LL");
  }

  render() {
    return (
      <div className={`activity-header ${this.props.clickable && 'clickable'}`} onClick={this.props.clickable && this.props.onClick}>
        {this.state.title}
        <div className="pull-right font-small font-light">{this.dateString()}</div>
      </div>
    )
  }
}

ActivityHeader.propTypes = {
  currentUser: React.PropTypes.object.isRequired,
  activity: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func,
  clickable: React.PropTypes.bool
};

ActivityHeader.defaultProps = {
  date: null,
  onClick: () => {
    return;
  },
  clickable: false
}
