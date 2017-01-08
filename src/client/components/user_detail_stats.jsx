class UserDetailStats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user_stats: this.props.user_stats
    };
  }

  render() {
    var user_stats = this.state.user_stats;
    var last_sign_in = moment(user_stats.last_sign_in).fromNow();
    return (
      <div className="card">
        <div className="card-header">User Stats</div>
        <div className="card-row">
          <span className="card-label">Active Deals:</span>
          <span className="card-value">{user_stats.deal_count}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Last Login:</span>
          <span className="card-value">{last_sign_in}</span>
        </div>
      </div>
    )
  }
}

UserDetailStats.propTypes = {
  user_stats: React.PropTypes.object
}
