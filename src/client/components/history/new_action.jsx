class NewAction extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      note: '',
      typeValue: null,
      placeholder: 'Select activity type...'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleActivityChange = this.handleActivityChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  handleChange(event) {
    this.setState({note: event.target.value});
  }

  handleActivityChange(event) {
    var placeholder = 'Select activity type...';
    if (event) {
      placeholder = _.find(this.props.placeholders, p => {
        return p.type === event.value;
      }).value;

      this.actionTextArea.focus();
    }

    this.setState({
      typeValue: event
        ? event.value
        : null,
      placeholder: placeholder
    });
  }

  onSave() {
    let self = this;
    if (!this.state.typeValue) {
      return;
    }
    this.props.savingActivity(true);
    this.setState({note: '', typeValue: null, placeholder: 'Select activity type...'});

    var action = {
      note: this.state.note
    }

    createAction(action, this.props.deal.id, this.state.typeValue).then(result => {
      self.props.savingActivity(false);
    });
  }

  render() {
    return (
      <div className="new-logged-action-component row m-x-0">

        <div className="col-xs-12 p-x-0 card">
          <div className="new-logged-action-header">
            <Select name="activity-type-select" placeholder="Select an activity" value={this.state.typeValue} options={this.props.options} onChange={this.handleActivityChange}/>
          </div>

          <div className="history-divider"></div>
          <div className="new-logged-action-body">
            <Textarea ref={(actionTextArea) => {
              this.actionTextArea = actionTextArea;
            }} placeholder={this.state.placeholder} value={this.state.note} className="history-text-area" onChange={this.handleChange}/>
          </div>

          <ActivityControlsBar>
            <button className='small strong button' type="button" onClick={this.onSave} disabled={this.state.typeValue === null || (this.state.typeValue === 'deal_update' && this.state.note.length === 0)}>Log Activity</button>
            {this.props.isSaving && <div className="activity-saving-loader">
              <Loader/>
            </div>}
          </ActivityControlsBar>
        </div>

      </div>
    )
  }
}

NewAction.propTypes = {
  options: React.PropTypes.array,
  deal: React.PropTypes.object,
  tabName: React.PropTypes.string,
  tabIcon: React.PropTypes.string,
  onSave: React.PropTypes.func,
  onSaveComplete: React.PropTypes.func,
  isSaving: React.PropTypes.bool
};

NewAction.defaultProps = {
  tabName: 'Log Activity',
  tabIcon: 'add',
  isSaving: false,
  placeholders: [
    {
      type: 'deal_update',
      value: 'Describe the update...'
    }, {
      type: 'phone_call',
      value: 'Notes about the call...(Optional)'
    }, {
      type: 'meeting',
      value: 'Notes about the meeting...(Optional)'
    }, {
      type: 'email',
      value: 'Notes about the email...(Optional)'
    }
  ],
  options: [
    {
      value: 'deal_update',
      label: 'New update'
    }, {
      value: 'phone_call',
      label: 'Made phone call'
    }, {
      value: 'meeting',
      label: 'Had a meeting'
    }, {
      value: 'email',
      label: 'Sent an email'
    }
  ]
}
