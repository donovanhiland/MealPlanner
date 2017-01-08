class DealDetailNav extends React.Component {

  constructor(props) {
    super(props);

    this.setUpdatedDeal = this.setUpdatedDeal.bind(this);

    this.state = {
      showOptions: false,
      showLostDealForm: false,
      showNurtureDealForm: false,
      deal: this.props.deal
    }
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_DEAL_UPDATED_", this.setUpdatedDeal, this);
  }

  setUpdatedDeal(deal) {
    this.setState({deal: deal});
  }

  render() {
    var currentStatus = this.state.deal.current_status.status;
    return (
      <div id="sub-nav-component" className="deal-detail-nav-component">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className="container">
            <div className="sub-nav-title pull-left">
              <Breadcrumbs breadcrumbs={this.props.breadcrumbs} />
            </div>
            <div className="pull-right">
              <DealStatusSelector deal={this.state.deal} currentUser={this.props.currentUser}/>
            </div>
            <div className="clearfix"></div>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

DealDetailNav.propTypes = {
  breadcrumbs: React.PropTypes.array,
  deal: React.PropTypes.object,
  currentUser: React.PropTypes.object
}
