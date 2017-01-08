class UserDetail extends React.Component {

  constructor(props) {
    super(props);
    this.updateDealPrefs = this.updateDealPrefs.bind(this);

    this.state = {
      user: props.user,
      overlord: props.overlord,
      user_stats: props.user_stats,
      deal_pref: props.deal_pref,
      deal_type_prefs: props.deal_type_prefs,
      asset_type_prefs: props.asset_type_prefs,
      showEditDealPrefsModal: false
    };
  }

  updateDealPrefs(deal_pref) {
    this.setState({deal_pref: deal_pref});
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_DEAL_PREFS_UPDATED_", this.updateDealPrefs, this);
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="col-md-6 flush-left">
            <UserDetailContact user={this.state.user}></UserDetailContact>
            <br></br>
            <UserDetailStats user_stats={this.state.user_stats}></UserDetailStats>
            <br></br>
            <div className={this.state.overlord
              ? ""
              : "hidden"}>
              <UserDetailDealPrefs deal_pref={this.state.deal_pref} user={this.state.user} assetTypePrefs={this.state.asset_type_prefs} dealTypePrefs={this.state.deal_type_prefs}></UserDetailDealPrefs>
            </div>
            <br></br>
          </div>
          <div className="col-md-6 flush-right">
            {/* <ActivityFeed user={this.state.user}></ActivityFeed> */}
          </div>
        </div>
      </div>
    )
  }
}

UserDetail.propTypes = {
  user: React.PropTypes.object,
  user_stats: React.PropTypes.object,
  deal_pref: React.PropTypes.object,
  deal_type_prefs: React.PropTypes.array,
  asset_type_prefs: React.PropTypes.array,
  overlord: React.PropTypes.bool
};
