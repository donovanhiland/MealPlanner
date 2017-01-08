class DealHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      actions: props.initialActions,
      initialLoad: true,
      isSaving: false
    };
    this.actionDeleted = this.actionDeleted.bind(this);
    this.actionCreated = this.actionCreated.bind(this);
    this.actionUpdated = this.actionUpdated.bind(this);
    this.savingActivity = this.savingActivity.bind(this);
    this.refreshActivities = this.refreshActivities.bind(this);
  }

  componentDidMount() {
    var self = this;
    dispatcherRegistry.addEventlistener("_TRACKABLE_DELETED_", this.actionDeleted, this);
    dispatcherRegistry.addEventlistener("_NEW_ACTION_", this.actionCreated, this);
    dispatcherRegistry.addEventlistener("_TRACKABLE_UPDATED_", this.actionUpdated, this);
    dispatcherRegistry.addEventlistener("_REFRESH_ACTIVITIES_", this.refreshActivities);
    getActionsForDeal(this.props.deal).then(actions => {
      self.setState({actions: actions, initialLoad: false});
    }, error => {
      self.setState({initialLoad: false});
      console.log(error);
    });
  }

  refreshActivities() {
    var self = this;
    getActionsForDeal(this.props.deal).then(actions => {
      self.setState({actions: actions});
    });
  }

  actionUpdated(action) {
    var actions = _.map(this.state.actions, a => {
      if (action.id === a.trackable.id) {
        a.trackable = action;
      }
      return a;
    });
    this.setState({actions: actions});
  }

  actionCreated(response) {
    var self = this;
    getActionsForDeal(this.props.deal).then(actions => {
      self.setState({actions: actions});
    });
  }

  actionDeleted(action) {
    var currentActions = this.state.actions;
    var newActions = _.filter(currentActions, a => {
      return JSON.stringify(a.trackable) !== JSON.stringify(action)
    });
    this.setState({actions: newActions});
  }

  savingActivity(isSaving) {
    let delay = isSaving
      ? 0
      : 500;
    setTimeout(() => {
      this.setState({isSaving: isSaving});
    }, delay);
  }

  render() {
    var self = this;
    var activityNodes = _.map(this.state.actions, (activity, index, activities) => {
      return (<ActivityRow key={activity.id} activity={activity} currentUser={this.props.currentUser} isLast={activities.length - 1 == index}/>);
    });

    return (
      <div className="history-component">
        <TabController>
          <NewAction isSaving={this.state.isSaving} savingActivity={this.savingActivity} deal={this.props.deal}></NewAction>
          <AddTask currentUser={this.props.currentUser} deal={this.props.deal}></AddTask>
        </TabController>
        {this.state.initialLoad && <div className="m-top-xl"><Loader/></div>}
        {this.state.actions.length > 0 && !this.state.initialLoad && <HistorySpacer/>}
        <div className="activity-component">{activityNodes}</div>
      </div>
    )
  }
}

DealHistory.propTypes = {
  deal: React.PropTypes.object,
  actions: React.PropTypes.array,
  currentUser: React.PropTypes.object
};
DealHistory.defaultProps = {
  initialActions: []
};
