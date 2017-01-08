class DealRequirements extends React.Component {

  constructor(props) {
    super(props);
    this.onTruncatedClick = this.onTruncatedClick.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.onSubmitEditForm = this.onSubmitEditForm.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);

    var editedRequirements = JSON.parse(JSON.stringify(props.deal.deal_requirements));

    this.state = {
      summaryIsTruncated: this.getShouldTruncate(),
      editedRequirements: editedRequirements,
      showEditModal: false,
      editSubmitButtonEnabled: false,
      isSaving: false
    };
  }

  getSummaryFromHash() {
    let summaryText = "Unknown";
    var reqNodes = this.props.deal.deal_requirements.map(function(req) {
      if (req.database_name == "comment") {
        summaryText = req.value;
      }
    });

    return summaryText;
  }

  getTruncatedSummary() {
    let summaryText = this.getSummaryFromHash();
    let truncatedSummary = summaryText.split(/\s+/).slice(0, 25).join(" ");
    return truncatedSummary;
  }

  getShouldTruncate() {
    let shouldTruncate = false;
    let summaryTextLength = this.getSummaryFromHash().length;
    if (this.props.deal.current_status.status !== 'assigned' && summaryTextLength > 25) {
      shouldTruncate = true;
    }

    return shouldTruncate;
  }

  onTruncatedClick(e) {
    if (this.state.summaryIsTruncated) {
      this.setState({summaryText: this.getSummaryFromHash(), summaryIsTruncated: false});
    } else {
      this.setState({summaryText: this.getTruncatedSummary(), summaryIsTruncated: false});
    }

  }

  showEditModal(shouldShow) {
    // Reset the editedRequirements, mainly for when you close the modal with a cancel or x
    let editedRequirements = JSON.parse(JSON.stringify(this.props.deal.deal_requirements));
    this.setState({showEditModal: shouldShow, editedRequirements: editedRequirements, editSubmitButtonEnabled: false});
  }

  onSubmitEditForm(event) {
    event.preventDefault();

    var self = this;

    let isDifferent = this.isFormDifferent(this.state.editedRequirements, this.props.deal.deal_requirements);
    if (!isDifferent) {
      return false;
    }

    this.setState({isSaving: true, editSubmitButtonEnabled: false});

    let editedDeal = JSON.parse(JSON.stringify(this.props.deal));
    editedDeal["deal_requirements"] = this.state.editedRequirements;

    // Convert the deal requirements to actual model structure
    let deal = {}
    _.each(this.state.editedRequirements, function(req) {
      let value;
      if (Number(req.database_value) === 0) {
        value = 0;
      } else {
        value = Number(req.database_value) || req.database_value;
      }

      deal[req.database_name] = value;
    })

    let objectForRequest = {
      id: this.props.deal.id,
      deal: deal
    }
    updateResource(objectForRequest, "deals", "deal").then(result => {
      this.setState({isSaving: false, editSubmitButtonEnabled: false, showEditModal: false});
      console.log(result)
    }, error => {
      this.setState({isSaving: false, editSubmitButtonEnabled: false});
      console.error(error.toString());
    });
  }

  handleValueChange(event, isValid) {
    var editedRequirements = this.state.editedRequirements;
    // Find the correct requirement
    let index = -1;
    let theReq = _.find(editedRequirements, function(req) {
      index += 1;
      return req.database_name == event.target.name;
    });
    if (!theReq) {
      return;
    }
    theReq["database_value"] = event.target.value;
    theReq["value"] = event.target.value;
    editedRequirements[index] = theReq;

    let isDifferent = this.isFormDifferent(editedRequirements, this.props.deal.deal_requirements);
    let canSubmit = (isDifferent && isValid) || false;
    this.setState({editedRequirements: editedRequirements, editSubmitButtonEnabled: canSubmit});
  }

  isFormDifferent(edited, original) {
    return !_.isEqual(edited, original);
  }

  render() {

    let self = this;
    let count = 0;
    let truncate = self.state.summaryIsTruncated;

    var reqNodes = this.props.deal.deal_requirements.map(function(req) {
      count += 1;

      if (req.database_name === "comment") {
        return (
          <div key={count} className="card-row">
            <span className="card-label">{req.display_name}:</span>
            <span className={truncate
              ? "card-value truncated"
              : "card-value"}>
              {truncate
                ? self.getTruncatedSummary()
                : req.value}
              <span className="truncated-show">...
                <span className="link" onClick={self.onTruncatedClick}>&nbsp; View More</span>
              </span>
            </span>
          </div>
        )
      } else {
        return (
          <div key={count} className="card-row">
            <span className="card-label">{req.display_name}:</span>
            <span className="card-value">{formatValueWithFormatter(req.value, req.formatter)}</span>
          </div>
        )
      }

    });

    let buttons = (
      <div className="buttons-section">
        <button className={`button pull-right strong ${this.state.editSubmitButtonEnabled
          ? ''
          : 'disabled'}`} disabled={!this.state.editSubmitButtonEnabled} onClick={this.onSubmitEditForm}>Submit</button>
        <button className="button secondary pull-right" onClick={() => this.showEditModal(false)}>Cancel</button>
      </div>
    );
    let loader = (
      <div className={`${this.state.isSaving
        ? ''
        : 'hidden'}`}>
        <Loader/>
      </div>
    );

    return (
      <div className="card deal-requirements-component">
        {this.state.showEditModal && <BrixioModal title="Edit Deal Requirements" onClose={() => this.showEditModal(false)} buttons={buttons} footerLeft={loader}>
          <EditDealRequirements requirements={this.state.editedRequirements} handleValueChange={this.handleValueChange} isSaving={this.state.isSaving} onSubmit={this.onSubmitEditForm}/>
        </BrixioModal>}
        <div className="card-header">Deal Requirements
          <div className="card-header-button">
            <i className="material-icons" onClick={() => this.showEditModal(true)}>mode_edit</i>
          </div>

        </div>
        {reqNodes}
      </div>
    )
  }
}
DealRequirements.propTypes = {
  deal: React.PropTypes.object
}
