class UserDetailDealPrefs extends React.Component {

  constructor(props) {
    super(props);

    this.updateDealPrefs = this.updateDealPrefs.bind(this);
    this.showEditDealPrefsModalOnClick = this.showEditDealPrefsModalOnClick.bind(this);
    this.closeModal = this.closeModal.bind(this);

    var dealPref = this.props.deal_pref;
    var location = dealPref.desired_location || "Unknown";
    var onDealTypes = dealPref.deal_type_prefs
      ? dealPref.deal_type_prefs.filter(function(pref) {
        return pref.on
      })
      : [];
    var dealTypesString = onDealTypes.map(function(option) {
      return option['deal_type']
    }).join(', ') || "Unknown";

    var onAssetTypes = dealPref.asset_type_prefs
      ? dealPref.asset_type_prefs.filter(function(pref) {
        return pref.on
      })
      : [];
    var assetTypesString = onAssetTypes.map(function(option) {
      return option['asset_type']
    }).join(', ') || 'Unknown';

    this.state = {
      dealPref: this.props.deal_pref,
      dealTypes: dealTypesString,
      assetTypes: assetTypesString,
      location: location,
      showEditDealPrefsModal: false
    };
  }

  updateDealPrefs(dealPref) {
    var dealPref = this.props.deal_pref;
    var location = dealPref.desired_location || "Unknown";
    var onDealTypes = dealPref.deal_type_prefs
      ? dealPref.deal_type_prefs.filter(function(pref) {
        return pref.on
      })
      : [];
    var dealTypesString = onDealTypes.map(function(option) {
      return option['deal_type']
    }).join(', ') || "Unknown";

    var onAssetTypes = dealPref.asset_type_prefs
      ? dealPref.asset_type_prefs.filter(function(pref) {
        return pref.on
      })
      : [];
    var assetTypesString = onAssetTypes.map(function(option) {
      return option['asset_type']
    }).join(', ') || 'Unknown';

    this.setState({dealPref: dealPref, dealTypes: dealTypesString, assetTypes: assetTypesString, location: location});
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_DEAL_PREFS_UPDATED_", this.updateDealPrefs, this);
  }

  showEditDealPrefsModalOnClick(e) {
    e.preventDefault();
    this.setState({showEditDealPrefsModal: true});
  }

  closeModal() {
    this.setState({showEditDealPrefsModal: false});
  }

  render() {
    return (
      <div className="card">

        {this.state.showEditDealPrefsModal && <EditDealPrefsModal user={this.props.user} deal_pref={this.state.dealPref} asset_type_prefs={this.props.assetTypePrefs} deal_type_prefs={this.props.dealTypePrefs} closeModal={this.closeModal}/>}

        <div className="card-header">
          Deal Preferences
          <div className="card-header-button">
            <a href="" onClick={this.showEditDealPrefsModalOnClick}>
              <i className="material-icons">mode_edit</i>
            </a>
          </div>
        </div>
        <div className="card-row">
          <div className="card-label">Location:</div>
          <div className="card-value">{this.state.location}</div>
        </div>
        <div className="card-row">
          <div className="card-label">Deal Types:</div>
          <div className="card-value">{this.state.dealTypes}</div>
        </div>
        <div className="card-row">
          <div className="card-label">Asset Types</div>
          <div className="card-value">{this.state.assetTypes}</div>
        </div>
      </div>
    )
  }
}

UserDetailDealPrefs.propTypes = {
  deal_pref: React.PropTypes.object
}
