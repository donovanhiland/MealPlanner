class EditDealPrefsModal extends React.Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleAssetTypeSelect = this.handleAssetTypeSelect.bind(this);
    this.handleDealTypeSelect = this.handleDealTypeSelect.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.dealTypeChecked = this.dealTypeChecked.bind(this);
    this.dealTypeForKey = this.dealTypeForKey.bind(this);
    this.assetTypeForKey = this.assetTypeForKey.bind(this);
    this.closeModal = this.closeModal.bind(this);

    var jsonDealPref = JSON.parse(JSON.stringify(props.deal_pref));
    var desiredLocation = jsonDealPref.desired_location || '';
    var assetTypePrefs = jsonDealPref.asset_type_prefs || [];
    var dealTypePrefs = jsonDealPref.deal_type_prefs || [];
    var allAssetTypes = props.asset_type_prefs;
    var allDealTypes = props.deal_type_prefs;

    var update = props.deal_pref["id"]
      ? true
      : false;

    this.state = {
      user: props.user,
      dealPref: props.deal_pref,
      desiredLocation: desiredLocation,
      assetTypePrefs: assetTypePrefs,
      dealTypePrefs: dealTypePrefs,
      allAssetTypes: allAssetTypes,
      allDealTypes: allDealTypes,
      update: update
    };
  }

  componentDidMount() {}

  closeModal() {
    this.props.closeModal();
  }

  handleLocationChange(event) {
    var dealPrefs = this.state.desiredLocation;
    this.setState({desiredLocation: event.target.value});
  }

  handleAssetTypeSelect(event) {
    var assetTypePrefs = this.state.assetTypePrefs || [];
    var assetType = this.assetTypeForKey(event.target.value);
    if (assetType) {
      assetType.on = event.target.checked;
    } else {
      assetType = {
        "asset_type": event.target.value,
        "on": event.target.checked
      };
    }

    var newAssetTypes = assetTypePrefs.filter(function(assetType) {
      return assetType.asset_type !== event.target.value;
    });

    newAssetTypes.push(assetType);
    this.setState({assetTypePrefs: newAssetTypes});
  }

  handleDealTypeSelect(event) {
    var dealTypePrefs = this.state.dealTypePrefs || [];
    var dealType = this.dealTypeForKey(event.target.value);
    if (dealType) {
      dealType.on = event.target.checked;
    } else {
      dealType = {
        "deal_type": event.target.value,
        "on": event.target.checked
      };
    }

    var newDealTypes = dealTypePrefs.filter(function(dealType) {
      return dealType.deal_type !== event.target.value;
    });

    newDealTypes.push(dealType);
    this.setState({dealTypePrefs: newDealTypes});
  }

  onSubmit(event) {
    var location = this.state.desiredLocation || '';
    var assetTypePrefs = this.state.assetTypePrefs || [];
    var dealTypePrefs = this.state.dealTypePrefs || [];
    var payload = {
      deal_pref: {
        user_id: this.state.user.id,
        desired_location: location,
        asset_type_prefs_attributes: assetTypePrefs,
        deal_type_prefs_attributes: dealTypePrefs
      }
    };

    var dealPref = this.state.dealPref;
    dealPref.desired_location = location;
    dealPref.asset_type_prefs = assetTypePrefs;
    dealPref.deal_type_prefs = dealTypePrefs;
    this.setState({dealPref: dealPref});

    event.preventDefault();
    dispatcherRegistry.dispatch("_DEAL_PREFS_UPDATED_", this.state.dealPref);
    this.closeModal();
    var httpType = this.state.update
      ? "PATCH"
      : "POST";
    $.ajax({
      url: '/api/v2/users/' + this.state.user.id + '/deal_prefs',
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json',
      cache: false,
      type: httpType,
      success: function(data) {
        dispatcherRegistry.dispatch("_DEAL_PREFS_UPDATED_", data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });
  }

  dealTypeChecked(key) {
    var dealType = this.dealTypeForKey(key);
    if (dealType) {
      return dealType.on;
    }
    return false;
  }

  assetTypeChecked(key) {
    var assetType = this.assetTypeForKey(key);
    if (assetType) {
      return assetType.on;
    }
    return false;
  }

  assetTypeForKey(key) {
    var returnVal = null;
    var assetPrefs = this.state.assetTypePrefs || [];
    assetPrefs.map(function(option) {
      if (option['asset_type'] == key) {
        returnVal = option;
      }
    });
    return returnVal;
  }

  dealTypeForKey(key) {
    var returnVal = null;
    var dealPrefs = this.state.dealTypePrefs || [];
    dealPrefs.map(function(option) {
      if (option['deal_type'] == key) {
        returnVal = option;
      }
    });
    return returnVal;
  }

  render() {
    var self = this;

    var dealPrefLocation = this.state.desiredLocation;
    var dealTypeOptions = this.state.allDealTypes.map(function(option) {
      var key = option[0];
      return (
        <div key={key} className="top-spacing-normal">
          <label><input className="top-spacing-normal normal" type="checkbox" defaultChecked={self.dealTypeChecked(key)} value={key} onChange={self.handleDealTypeSelect}/> {key}</label>
          <br/>
        </div>
      )
    });

    var assetTypeOptions = this.state.allAssetTypes.map(function(option) {
      var key = option[0];
      return (
        <div key={key} className="top-spacing-normal">
          <label><input className="top-spacing-normal normal" type="checkbox" defaultChecked={self.assetTypeChecked(key)} value={key} onChange={self.handleAssetTypeSelect}/> {key}</label>
          <br/>
        </div>
      )
    });

    let buttons = (
      <div className="buttons-section">
        <button className="button pull-right strong" onClick={this.onSubmit}>Save</button>
        <button className="button secondary pull-right" onClick={this.closeModal}>Cancel</button>
      </div>
    );

    return (

      <BrixioModal title="Edit Deal Preferences" onClose={this.closeModal} buttons={buttons}>
        <Validation.components.Form onSubmit={this.onSubmit}>
          <BrixioTextField type="text" value={dealPrefLocation} onChange={this.handleLocationChange} name="deal_pref_location" placeholder={"Preferred Location"} validations={["required"]}/>
          <div className="m-y-md font-dark">Deal Type:</div>
          {dealTypeOptions}
          <div className="m-y-md font-dark">Asset Type:</div>
          {assetTypeOptions}
          <input className="hidden" type="submit"/>
        </Validation.components.Form>
      </BrixioModal>

    )
  }
}

EditDealPrefsModal.propTypes = {
  user: React.PropTypes.object,
  deal_pref: React.PropTypes.object,
  deal_type_prefs: React.PropTypes.array,
  asset_type_prefs: React.PropTypes.array
};
