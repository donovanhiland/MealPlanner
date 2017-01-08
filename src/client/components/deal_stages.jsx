class DealStages extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.publishStage = this.publishStage.bind(this);
    this.setUpdatedDeal = this.setUpdatedDeal.bind(this);
    this.state = {
      deal: props.deal,
      currentStage: props.currentStage,
      activeStep: props.currentStage.sort_index
    }
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_DEAL_UPDATED_", this.setUpdatedDeal, this);
  }

  setUpdatedDeal(deal) {
    this.setState({deal: deal});
  }

  publishStage(dealId, stageId) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: '/api/v2/deals/' + dealId + '/current_stage',
        data: JSON.stringify({
          deal: {
            current_stage: stageId
          }
        }),
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        type: "PATCH",
        success: function(data) {
          resolve(data);
        }.bind(this),
        error: function(xhr, status, err) {
          reject(err);
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  }

  handleChange(stageId, sortIndex) {
    this.setState({activeStep: sortIndex});

    var deal = this.state.deal;
    _.each(deal.deal_stages, function(stage) {
      if (stage.id === stageId) {
        stage.activated_at = new Date().getTime();
      }
    });

    var status = (deal.deal_stages.length - 1) === sortIndex
      ? 'closed'
      : 'working';

    deal.current_status = {
      status: status
    };
    dispatcherRegistry.dispatch("_DEAL_UPDATED_", deal);

    var self = this;
    this.publishStage(deal.id, stageId).then(result => {
      self.setState({deal: result, currentStage: result.current_stage, activeStep: result.current_stage.sort_index});
      dispatcherRegistry.dispatch("_DEAL_UPDATED_", deal);
    }, reason => {
      console.log(reason);
    });

  }

  render() {

    let self = this;
    var deal_stages = this.state.deal.deal_stages.map(function(stage) {
      return (
        <MaterialUi.Step key={stage.id}>
          <MaterialUi.StepButton onClick={self.handleChange.bind(null, stage.id, stage.sort_index)} disableTouchRipple={true}>
            {stage.name}
          </MaterialUi.StepButton>
        </MaterialUi.Step>
      )
    });

    return (
      <div className="container card stages-component">
        <div className="flush-sides">
          <div className="stages-container">
            <MaterialUi.Stepper linear={false} activeStep={this.state.activeStep}>
              {deal_stages}
            </MaterialUi.Stepper>
          </div>
        </div>
      </div>
    )
  }
}

DealStages.propTypes = {
  deal: React.PropTypes.object,
  currentStage: React.PropTypes.object,
  activeStep: React.PropTypes.number
};
