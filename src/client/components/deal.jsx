class Deal extends React.Component {

  constructor(props) {
    super(props);
    var deal = this.props.deal;
    var location = deal.desired_location || (deal.address
      ? deal.address.city
      : "Unknown");
    var agent = deal.user
      ? deal.user.first_name + " " + deal.user.last_name
      : "Unknown";
    var person = deal.person
      ? deal.person.name
      : "Unknown";
    var orgName = deal.organization
      ? deal.organization.name
      : "Unknown";
    var assetType = deal.asset_type
      ? deal.asset_type.name
      : "Unknown";
    var currentStage = deal.current_stage
      ? deal.current_stage.name
      : "Unknown";
    var currentBudget = !deal.budget || deal.budget == 0
      ? "Unknown"
      : numeral(deal.budget).format('$0,0');
    if (deal.budget == -1) {
      currentBudget = "Unlimited";
    }
    var currentSquareFeet = !deal.square_feet || deal.square_feet == 0
      ? "Unknown"
      : numeral(deal.square_feet).format('0,0');

    this.state = {
      squareFeet: deal.square_feet,
      budget: currentBudget,
      timeFrame: deal.time_frame,
      createdAt: moment(deal.created_at).format('MMM DD, \'YY'),
      contactName: person,
      assetType: assetType,
      dealType: deal.deal_type,
      location: location,
      stage: currentStage,
      status: deal.current_status.status,
      organization: orgName,
      agent: agent,
      id: deal.id
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if (!$(e.target).hasClass('deal-row-notes-icon')) {
      let link = "/deals/" + this.state.id;
      window.open(link, '_blank');
    }
  }

  render() {
    var statusClass = "table-dot " + this.state.status;
    var notesUrl = "/deals/" + this.state.id + "/modal_notes";

    return (
      <tr className='clickable-row deal-component' onClick={this.handleClick}>
        <td>
          <span className="id-hint">id: {this.state.id}</span>{this.state.createdAt}</td>
        <td className={(this.props.currentUserRole == "overlord")
          ? ""
          : "hidden"}>{this.state.organization}</td>
        <td className={(this.props.currentUserRole == "overlord" || this.props.currentUserOrgRole == "admin" || this.props.currentUserOrgRole == "manager")
          ? ""
          : "hidden"}>{this.state.agent}</td>
        <td>{this.state.contactName}</td>
        <td>{this.state.assetType}</td>
        <td>{this.state.dealType}</td>
        <td>{this.state.squareFeet}</td>
        <td>{this.state.budget}</td>
        <td>{this.state.location}</td>
        <td>{this.state.stage}</td>
        <td className="status">
          <span className={statusClass}></span>{this.state.status}</td>
        <td className="notes-icon-holder">
          <a data-toggle="modal" data-target="#deal-notes-modal" data-remote="true" href={notesUrl}>
            <i className="material-icons deal-row-notes-icon" data-toggle="tooltip" title="" data-original-title="DEAL NOTES">chat</i>
          </a>
        </td>
      </tr>
    )
  }
}

Deal.propTypes = {
  deal: React.PropTypes.object
};
