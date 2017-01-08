class ClaimDeal extends React.Component {

  constructor(props) {
    super(props);
    this.claimDeal = this.claimDeal.bind(this);
    this.declineDeal = this.declineDeal.bind(this);
    this.confirmDeclineDeal = this.confirmDeclineDeal.bind(this);
    this.hideConfirmDialog = this.hideConfirmDialog.bind(this);

    this.state = {
      deal: this.props.deal,
      showConfirmDialog: false
    }
  }

  claimDeal() {
    var deal = this.state.deal;
    deal.status = 'working';
    deal.current_status = {
      status: 'working'
    };

    this.setState({deal: deal});
    dispatcherRegistry.dispatch("_DEAL_UPDATED_", deal);

    var status = {
      deal_id: this.state.deal.id,
      status: 'working'
    }
    postNewStatus(status).then().catch(error => {
      console.log('Failed to claim the deal: ' + error.toString());
    });
  }

  declineDeal() {
    this.setState({showConfirmDialog: true});
  }

  confirmDeclineDeal() {
    var deal = this.state.deal;
    deal.status = 'declined';
    deal.current_status = {
      status: 'declined'
    }
    dispatcherRegistry.dispatch("_DEAL_UPDATED_", deal);

    var status = {
      deal_id: this.state.deal.id,
      status: 'declined'
    }

    postNewStatus(status).then(result => {
      window.location.href = '/deals';
    }, error => {
      console.log("Error declining the deal: " + error.toString());
    });
  }

  hideConfirmDialog() {
    this.setState({showConfirmDialog: false});
  }

  render() {
    return (
      <div>
        {this.state.showConfirmDialog && <ConfirmDialog message={'When you decline a deal it lets Brixio know you are not working it. You will no longer see the deal. Are you ready to decline this deal?'} cancelAction={this.hideConfirmDialog} confirmAction={this.confirmDeclineDeal} confirmButtonText={'Decline'} title="Decline this deal?"/>}

        {this.state.deal.current_status.status === 'assigned' && this.state.deal.user.id == this.props.currentUser.id
          ? <div className="col-md-12 flash-notice info claim-deal-header">
              <i className="material-icons">info</i>
              <span className="notice">Claim or Decline the deal</span>
              <div className="pull-right">
                <button onClick={this.claimDeal} className="button white strong pull-right">Claim</button>
                <button onClick={this.declineDeal} className="button white" style={{
                  "marginRight": "10px"
                }}>Decline</button>
              </div>
            </div>
          : null}

      </div>
    )
  }
}

ClaimDeal.propTypes = {
  deal: React.PropTypes.object,
  currentUser: React.PropTypes.object
}
