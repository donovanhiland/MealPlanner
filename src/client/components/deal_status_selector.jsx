class DealStatusSelector extends React.Component {

  constructor(props) {
    super(props);
    this.handleStatusClick = this.handleStatusClick.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateDeal = this.updateDeal.bind(this);
    this.setUpdatedDeal = this.setUpdatedDeal.bind(this);
    this.finalizeArchive = this.finalizeArchive.bind(this);
    this.onClickOut = this.onClickOut.bind(this);

    this.state = {
      deal: props.deal,
      showOptions: false,
      showArchiveDealForm: false
    }
  }

  onClickOut() {
    this.setState({showOptions: false});
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_DEAL_UPDATED_", this.setUpdatedDeal, this);
  }

  setUpdatedDeal(deal) {
    this.setState({deal: deal});
  }

  updateDeal(deal) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: '/api/v2/deals/' + deal.id,
        data: {
          'deal': {
            'status': deal.status,
            'reason': deal.responseCode
          }
        },
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        type: "PATCH",
        success: function(data) {
          resolve(data);
        }.bind(this),
        error: function(xhr, status, err) {
          reject(err);
        }.bind(this)
      });
    });
  }

  updateStatus(status) {
    this.setState({showOptions: false});
    var self = this;
    switch (status) {
      case 'working':
        var status = {
          deal_id: this.props.deal.id,
          status: 'working'
        };
        postNewStatus(status).then(result => {
          self.setState({deal: result.deal});
        }, error => {
          alert('Sorry something went wrong. Please try again.');
        });
        break;
      case 'archived':
        this.setState({showArchiveDealForm: true});
        break;
      default:
        console.log("unexpected status");
    }

  }

  finalizeArchive(didSave, responseCode, comment) {
    this.setState({showArchiveDealForm: false});
    var self = this;

    if (didSave) {

      var newNotePromise = new Promise(function(resolve, reject) {
        if (comment) {
          var note = {
            deal_id: self.props.deal.id,
            user_id: self.props.currentUser.id,
            text: comment
          };
          resolve(publishNote(note));
        } else {
          resolve(false);
        }
      });

      newNotePromise.then(result => {
        if (result) {
          notifyNewNoteWatchers(result);
        }
        var status = {
          deal_id: self.props.deal.id,
          status: 'archived',
          reason: parseInt(responseCode),
          note_id: result.id
        };
        return postNewStatus(status);
      }).then(result => {
        notifyNewDealWatchers(result.deal);
      }, error => {
        console.error(error.toString());
      });
    }
  }

  handleStatusClick() {
    this.setState({
      showOptions: !this.state.showOptions
    });
  }

  render() {
    var currentStatus = this.state.deal.current_status.status;
    var statusClass = currentStatus + " deal-status-selector all-transition";
    return (
      <ClickOutHandler onClickOut={this.onClickOut}>
        {currentStatus === 'working' || currentStatus === 'archived' || currentStatus === 'closed' || this.props.currentUser.role == "overlord"
          ? <div className="deal-status-selector-container deal-status-selector-component">
              <div className={statusClass} onClick={currentStatus !== 'closed'
                ? this.handleStatusClick
                : null}>
                <span className='deal-status-dot'></span>
                {currentStatus}
                {currentStatus !== 'closed'
                  ? <span className="arrow-down"></span>
                  : null}
              </div>
              {this.state.showOptions
                ? <div className="deal-status-options">
                    <div className="option" onClick={this.updateStatus.bind(null, currentStatus === 'working'
                      ? 'archived'
                      : 'working')}>
                      <i className="material-icons status-change-icon">{currentStatus === 'working'
                          ? 'archive'
                          : 'work'}</i>
                      <span className="title">{currentStatus === 'working'
                          ? 'Archive deal'
                          : 'Work deal'}</span>
                    </div>
                  </div>
                : null}

              {this.state.showArchiveDealForm
                ? <ArchiveFeedbackForm formDidClose={this.finalizeArchive}></ArchiveFeedbackForm>
                : null}

            </div>
          : <div></div>}

      </ClickOutHandler>

    )
  }
}
DealStatusSelector.propTypes = {
  deal: React.PropTypes.object,
  currentUser: React.PropTypes.object
}
