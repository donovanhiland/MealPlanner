class EditDealModal extends React.Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this);
    this.handleLeaseTermChange = this.handleLeaseTermChange.bind(this);
    this.handleTimeFrameChange = this.handleTimeFrameChange.bind(this);
    this.handleDealTypeChange = this.handleDealTypeChange.bind(this);
    this.updateDropDowns = this.updateDropDowns.bind(this);
    this.closeModal = this.closeModal.bind(this);

    var editDeal = JSON.parse(JSON.stringify(props.deal));
    editDeal.name = editDeal.name || "";
    editDeal.desired_location = editDeal.desired_location || "";

    this.state = {
      deal: props.deal,
      editDeal: editDeal,
      leaseOption: '',
      timeFrameOption: '',
      dealTypeOption: '',
      desiredLocation: ''
    }
  }

  componentDidMount() {
    this.updateDropDowns();
  }

  updateDropDowns() {
    var self = this;
    var leaseOption = _.filter(this.props.leaseTermOptions, function(option) {
      return option.value === self.state.deal.desired_lease_term;
    });

    leaseOption = leaseOption.length > 0
      ? leaseOption[0].value
      : undefined;

    var timeFrame = _.filter(this.props.timeFrameOptions, function(option) {
      return option.value === self.state.deal.time_frame;
    });

    timeFrame = timeFrame.length > 0
      ? timeFrame[0].value
      : undefined;

    var dealType = _.filter(this.props.dealTypeOptions, function(option) {
      return option.value === self.state.deal.deal_type;
    });

    dealType = dealType.length > 0
      ? dealType[0].value
      : undefined;

    this.setState({leaseOption: leaseOption, timeFrameOption: timeFrame, dealTypeOption: dealType});
  }

  closeModal(event) {
    if (event) {
      var deal = JSON.parse(JSON.stringify(this.state.deal));
      this.setState({editDeal: deal});
      dispatcherRegistry.dispatch("_SHOW_EDIT_MODAL_", {shouldShow: false});
    }
  }

  handleDetailsChange(event) {
    var deal = this.state.editDeal;
    deal[event.target.name] = event.target.value;
    this.setState({editDeal: deal});
  }

  handleTimeFrameChange(event, index, value) {
    var deal = this.state.editDeal;
    var option = this.props.timeFrameOptions[index].value;
    deal.time_frame = value;
    this.setState({editDeal: deal, timeFrameOption: option});
  }

  handleDealTypeChange(event, index, value) {
    var deal = this.state.editDeal;
    var option = this.props.dealTypeOptions[index].value;
    deal.deal_type = value;
    this.setState({editDeal: deal, dealTypeOption: option});
  }

  handleLeaseTermChange(event, index, value) {
    var option = this.props.leaseTermOptions[index].value;
    var deal = this.state.editDeal;
    deal.desired_lease_term = value;
    this.setState({editDeal: deal, leaseOption: option});
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      deal: JSON.parse(JSON.stringify(this.state.editDeal))
    });
    dispatcherRegistry.dispatch("_SHOW_EDIT_MODAL_", {shouldShow: false});
    dispatcherRegistry.dispatch("_DEAL_UPDATED_", this.state.deal);
    $.ajax({
      url: '/api/v2/deals/' + this.props.deal.id,
      data: JSON.stringify({deal: this.state.editDeal}),
      dataType: 'json',
      contentType: 'application/json',
      cache: false,
      type: "PATCH",
      success: function(data) {
        dispatcherRegistry.dispatch("_DEAL_UPDATED_", data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });
  }

  render() {

    var leaseOptions = this.props.leaseTermOptions.map(function(option) {
      return (<MaterialUi.MenuItem key={option.key} value={option.value} primaryText={option.name}/>)
    });
    var timeFrameOptions = this.props.timeFrameOptions.map(function(option) {
      return (<MaterialUi.MenuItem key={option.key} value={option.value} primaryText={option.name}/>)
    });
    var dealTypeOptions = this.props.dealTypeOptions.map(function(option) {
      return (<MaterialUi.MenuItem key={option.key} value={option.value} primaryText={option.name}/>)
    });

    return (
      <ReactModalDialog.ModalContainer onClose={this.closeModal} className="edit-deal-modal">
        <ReactModalDialog.ModalDialog onClose={this.closeModal} className="sup">
          <MuiThemeProvider muiTheme={muiTheme}>

            <div className="tabs-container">
              <MaterialUi.Tabs>
                <MaterialUi.Tab label="Edit Deal">
                  <form onSubmit={this.onSubmit}>

                    <div className="col-md-6">
                      <MaterialUi.TextField name="name" value={this.state.editDeal.name} onChange={this.handleDetailsChange} hintText="Deal Name" floatingLabelText="Deal Name" fullWidth={true}/>
                      <MaterialUi.TextField name="budget" value={this.state.editDeal.budget} onChange={this.handleDetailsChange} hintText="Budget" floatingLabelText="Budget" fullWidth={true}/>
                      <MaterialUi.TextField name="square_feet" value={this.state.editDeal.square_feet} onChange={this.handleDetailsChange} hintText="Desired Sq Ft" floatingLabelText="Desired Sq Ft" fullWidth={true}/>
                      <MaterialUi.SelectField value={this.state.leaseOption} onChange={this.handleLeaseTermChange} floatingLabelText="Desired Lease Term" fullWidth={true}>
                        {leaseOptions}
                      </MaterialUi.SelectField>
                    </div>

                    <div className="col-md-6">
                      <MaterialUi.TextField name="desired_location" value={this.state.editDeal.desired_location} onChange={this.handleDetailsChange} hintText="Desired Location" floatingLabelText="Desired Location" fullWidth={true}/>
                      <MaterialUi.SelectField value={this.state.dealTypeOption} onChange={this.handleDealTypeChange} floatingLabelText="Deal Type" fullWidth={true}>
                        {dealTypeOptions}
                      </MaterialUi.SelectField>
                      <MaterialUi.SelectField value={this.state.timeFrameOption} onChange={this.handleTimeFrameChange} floatingLabelText="Time Frame" fullWidth={true}>
                        {timeFrameOptions}
                      </MaterialUi.SelectField>
                    </div>

                    <div className="col-md-12 mui-tab-bottom">
                      <MaterialUi.RaisedButton className="mui-raised-button pull-right" style={{
                        "height": "26px"
                      }} type="submit" label="Save" labelPosition="before" primary={true} icon={< i className = "material-icons white" > keyboard_return < /i>} disableTouchRipple={true}/>
                    </div>
                    <div className="clearfix"></div>
                  </form>
                </MaterialUi.Tab>

              </MaterialUi.Tabs>
            </div>
          </MuiThemeProvider>
        </ReactModalDialog.ModalDialog>
      </ReactModalDialog.ModalContainer>
    )
  }
}

EditDealModal.propTypes = {
  deal: React.PropTypes.object
};

EditDealModal.defaultProps = {
  leaseTermOptions: [
    {
      key: '1',
      name: '1 year',
      value: 1
    }, {
      key: '2',
      name: '2 years',
      value: 2
    }, {
      key: '3',
      name: '3 years',
      value: 3
    }, {
      key: '4',
      name: '4 years',
      value: 4
    }, {
      key: '5',
      name: '5 years',
      value: 5
    }, {
      key: '6',
      name: '6 years',
      value: 6
    }, {
      key: '7',
      name: '7 years',
      value: 7
    }, {
      key: '8',
      name: '8 years',
      value: 8
    }, {
      key: '9',
      name: '9 years',
      value: 9
    }, {
      key: '10',
      name: '10 years',
      value: 10
    }
  ],
  timeFrameOptions: [
    {
      key: '1',
      name: 'ASAP',
      value: 'ASAP'
    }, {
      key: '2',
      name: '0-3 Months',
      value: '0-3 Months'
    }, {
      key: '3',
      name: '3-6 Months',
      value: '3-6 Months'
    }, {
      key: '4',
      name: '6-12 Months',
      value: '6-12 Months'
    }, {
      key: '5',
      name: '12+ Months',
      value: '12+ Months'
    }
  ],
  assetTypeOptions: [
    {
      key: '1',
      name: 'Office',
      value: 'office'
    }, {
      key: '2',
      name: 'Retail',
      value: 'retail'
    }, {
      key: '3',
      name: 'Industrial',
      value: 'Industrial'
    }, {
      key: '4',
      name: 'Warehouse',
      value: 'warehouse'
    }
  ],
  dealTypeOptions: [
    {
      key: '1',
      name: 'Lease',
      value: 'Lease'
    }, {
      key: '2',
      name: 'Buy',
      value: 'Buy'
    }, {
      key: '3',
      name: 'Sell',
      value: 'Sell'
    }, {
      key: '4',
      name: 'Build',
      value: 'Build'
    }, {
      key: '5',
      name: 'Lease or Buy',
      value: 'Lease or Buy'
    }, {
      key: '6',
      name: 'Lease, Build, or Buy',
      value: 'Lease, Build, or Buy'
    }, {
      key: '7',
      name: 'Build or Buy',
      value: 'Build or Buy'
    }
  ]
}
