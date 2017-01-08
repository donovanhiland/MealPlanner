class DealDetail extends React.Component {

  constructor(props) {
    super(props);
    this.updatePerson = this.updatePerson.bind(this);
    this.updateDeal = this.updateDeal.bind(this);
    this.state = {
      deal: props.deal,
      contacts: [props.deal.person],
      showContactEditModal: false,
      leaseOption: '',
      timeFrameOption: '',
      desiredLocation: '',
      dealTypeOption: ''
    };
  }

  updatePerson(person) {
    let deal = this.state.deal;
    deal.person = person;
    this.setState({contacts: [person], deal: deal});
  }

  updateDeal(deal) {
    this.setState({deal: deal});
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_PERSON_UPDATED_", this.updatePerson, this);
    dispatcherRegistry.addEventlistener("_DEAL_UPDATED_", this.updateDeal, this);
  }

  render() {
    return (
      <div className="deal-details">
        {!this.state.deal && <div style={{
          "height": "89px"
        }}/>}
        {this.state.deal && this.state.deal.current_status.status !== 'assigned' && <div className="stages-wrapper">
          <MuiThemeProvider muiTheme={muiTheme}>
            {this.state.deal && (this.state.deal.current_status.status !== 'assigned' || this.props.user.role === "overlord")
              ? <DealStages deal={this.state.deal} currentStage={this.state.deal.current_stage}></DealStages>
              : null}
          </MuiThemeProvider>
        </div>}
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className="container">
            {this.state.deal && this.state.deal.current_status.status === 'assigned'
              ? <ClaimDeal deal={this.state.deal} currentUser={this.props.user}></ClaimDeal>
              : null}
            <div className="col-md-6 flush-left">
              <ContactListLight contacts={this.state.contacts} deal={this.state.deal}></ContactListLight>
              <Tasks deal={this.props.deal} currentUser={this.props.user}></Tasks>
              {this.state.deal
                ? <DealRequirements deal={this.state.deal}></DealRequirements>
                : null}
              {this.state.deal
                ? <div className="card">
                    <div className="card-header">Primary Agent</div>
                    <div className="card-content">
                      <div className="float-left">
                        <Avatar user={this.state.deal.user} size='large'></Avatar>
                      </div>
                      <div className="float-left details">
                        <div className="collaborator-name">{this.state.deal.user.first_name + ' ' + this.state.deal.user.last_name}</div>
                      </div>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                : null}

            </div>
            <div className="col-md-6 flush-right">
              <DealHistory deal={this.props.deal} currentUser={this.props.user}></DealHistory>
            </div>
          </div>
        </MuiThemeProvider>
      </div>

    )
  }
}
DealDetail.propTypes = {
  deal: React.PropTypes.object.isRequired,
  dealId: React.PropTypes.string,
  contacts: React.PropTypes.array,
  user: React.PropTypes.object.isRequired,
  statusOptions: React.PropTypes.array,
  leaseTermOptions: React.PropTypes.array,
  timeFrameOptions: React.PropTypes.array,
  desiredLocation: React.PropTypes.string
};
