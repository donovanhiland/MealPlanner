class MasterDeal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
      dealAssignments: [],
      addAssignmentActive: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.disableSubmitButton = this.disableSubmitButton.bind(this);
    this.addAssignment = this.addAssignment.bind(this);
    this.removeAssignment = this.removeAssignment.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if (!$(e.target).hasClass('deal-row-notes-icon')) {
      window.location.href = `/deals/${this.props.id}`;
    }
  }

  disableSubmitButton(e) {
    this.setState({formSubmitted: true})
  }

  removeAssignment(e) {
    // TODO : the rest of this handler is still in jQuery in deals.js BAHAHA
    this.setState({addAssignmentActive: false})
  }

  addAssignment(e) {
    let self = this;
    let random = Date.now();

    let orgSelectOptions = _.map(self.props.organizations, function(value, index) {
      return <option key={index} value={value.id}>{value.name}</option>
    });
    console.log(orgSelectOptions);
    let orgSelect = (
      <select name={`assignments[${random}][organization_id]`} className="org-select">
        <option value>Choose Organization</option>
        {orgSelectOptions}
      </select>
    );
    let userSelect = (
      <select name={`assignments[${random}][user_id]`} className="org-broker-select" disabled>
        <option>Choose Broker</option>
      </select>
    );

    let newDiv = (
      <div key={Math.random() + 1}>
        <div className="assignment-row">
          <div className="remove-assignment" onClick={this.removeAssignment}>-</div>
          <div style={{
            marginLeft: 10,
            float: 'left'
          }}>{orgSelect}</div>
          <div style={{
            marginLeft: 10,
            float: 'left'
          }}>{userSelect}</div>
        </div>
        <div style={{
          clear: 'both'
        }}></div>
      </div>
    );
    let dealAssignments = this.state.dealAssignments;
    dealAssignments.push(newDiv);
    this.setState({dealAssignments: dealAssignments, addAssignmentActive: true})
  }

  render() {
    var notesUrl = `/deals/${this.props.id}/modal_notes`;

    var dealAssignmentNodes = this.props.deals.map(function(deal) {
      var lastViewed = deal.last_view_at
        ? moment(deal.last_view_at).format('MMM DD, \'YY')
        : "Never";
      var agent = deal.user
        ? `${deal.user.first_name} ${deal.user.last_name}`
        : "Unknown";
      var orgName = deal.organization
        ? deal.organization.name
        : "Unknown";
      var currentStage = deal.current_stage
        ? deal.current_stage.name
        : "Unknown";

      return (
        <DealAssignment key={deal.id} id={deal.id} organization={orgName} agent={agent} createdAtRaw ={deal.created_at} createdAt={moment(deal.created_at).format('MMM DD, \'YY')} lastViewed={lastViewed} status={deal.current_status.status} stage={currentStage} notesCount={deal.notes
          ? deal.notes.length
          : 0}></DealAssignment>
      )
    });

    var assignmentFormAction = `/master_deals/${this.props.id}`;

    return (
      <div className="card master-deal-component" style={{
        padding: "0px"
      }}>
        <div className={this.props.isAssigned
          ? 'hidden'
          : 'badge'}></div>
        <div className="card-header">Created {`${moment(this.props.createdAtRaw).fromNow()} `}
          on {this.props.createdAt}
          <div className="pull-right">id: {this.props.id}</div>
        </div>
        <div style={{
          padding: "10px"
        }}>
          <div style={{
            width: "20%",
            float: "left"
          }}>{this.props.contactName}</div>
          <div style={{
            width: "20%",
            float: "left"
          }}>{`${this.props.squareFeet} `}
            SF @ {this.props.budget}</div>
          <div style={{
            width: "20%",
            float: "left"
          }}>{this.props.timeFrame}</div>
          <div style={{
            width: "20%",
            float: "left"
          }}>{`${this.props.assetType} `} {this.props.dealType}</div>
          <div style={{
            width: "20%",
            float: "left"
          }}>{this.props.location}</div>
          <div className="clear"></div>
          <div className="comment">{this.props.comment}</div>
          <div className="section-title" style={{
            color: "rgba(0, 0, 0, 0.34)"
          }}>Assignments</div>
          <div className="clear"></div>

          <table style={{
            width: "100%",
            marginTop: "10px"
          }} className="assignments-table">
            <thead style={{
              fontSize: "12px",
              color: "rgba(0, 0, 0, 0.56)"
            }}>
              <tr>
                <th style={{
                  padding: "2px 0px"
                }}>Organization</th>
                <th>Agent</th>
                <th>Status</th>
                <th>Stage</th>
                <th>Notes</th>
                <th>Assigned</th>
                <th>Last Viewed</th>
              </tr>
            </thead>
            <tbody>
              {dealAssignmentNodes}
            </tbody>
          </table>
          <form className="edit_master_deal" action={assignmentFormAction} onSubmit={this.disableSubmitButton} acceptCharset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="✓"/>
            <input type="hidden" name="_method" value="patch"/>
            <input type="hidden" name="authenticity_token" value={this.props.authenticityToken}/>
            <div className="assignments">{this.state.dealAssignments}</div>

            <div className="clear"></div>

            <span className={`add-assignment ${this.state.addAssignmentActive
              ? 'add-assignment_active'
              : null}`} onClick={this.addAssignment}>+ Assignment</span>
            <button name="button" type="submit" className={`button small pull-right ${this.state.addAssignmentActive
              ? 'show-assign'
              : 'hide-assign'}`} disabled={this.state.formSubmitted}>
              Assign
            </button>
            <div className="clear"></div>

          </form>
        </div>
      </div>
    )
  }
}
MasterDeal.propTypes = {
  squareFeet: React.PropTypes.string,
  timeFrame: React.PropTypes.string,
  budget: React.PropTypes.string,
  createdAt: React.PropTypes.string,
  contactName: React.PropTypes.string,
  assetType: React.PropTypes.string,
  dealType: React.PropTypes.string,
  location: React.PropTypes.string
}
