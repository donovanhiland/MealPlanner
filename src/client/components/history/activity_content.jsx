class ActivityContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      trackable: props.trackable,
      editing: false,
      editedText: props.trackable.note,
      showControls: false
    }

    this.onSave = this.onSave.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.updateTrackable = this.updateTrackable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeControlsIfNeeded = this.closeControlsIfNeeded.bind(this);
  }

  handleChange(event) {
    this.setState({editedText: event.target.value});
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_TOGGLE_ACTIVITY_CONTROL_", this.closeControlsIfNeeded, this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editing && !prevState.editing) {
      this.refs.descriptionInput.focus();
    }
    if (!this.state.showControls && prevState.showControls) {
      this.setState({editing: false, editedText: this.props.trackable.note});
    }
  }

  closeControlsIfNeeded(sender) {
    if (sender !== this) {
      this.setState({showControls: false, editing: false});
    }
  }

  confirmDelete() {
    this.setState({trackable: null, showConfirmDialog: false});
    deleteTrackable(this.state.trackable, this.props.trackable.deal_id, toSnakeCase(this.props.type)).then(result => {}, error => {
      console.log(error);
    });
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing,
      editedText: this.props.trackable.note
    });
  }

  onSave() {
    var trackable = this.props.trackable;
    trackable.note = this.state.editedText;
    this.setState({editing: false, showControls: false});
    var path = `/api/v2/deals/${trackable.deal_id}/${toSnakeCase(this.props.type)}s/${trackable.id}`

    this.updateTrackable(trackable, path).then(result => {
      this.setState({trackable: result});
    }, error => {
      console.log("Update Failed: " + error);
    });
  }

  updateTrackable(trackable, path) {
    var self = this;
    var data = {}
    data[`${toSnakeCase(self.props.type)}`] = trackable;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: path,
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        type: "PATCH",
        success: data => {
          notifiyUpdatedTrackableWatchers(data);
          resolve(data);
        },
        error: error => {
          console.error(error.responseText);
          reject(error);
        }
      });
    });
  }

  render() {
    return (
      <div>
        <div className={`activity-body ${this.props.trackable.note.length === 0 && !this.state.editing && 'hidden'}`}>
          {this.state.showConfirmDialog && <ConfirmDialog message={'Are you sure you want to delete this activity?'} cancelAction={() => this.setState({showConfirmDialog: false})} confirmAction={this.confirmDelete} confirmButtonText={'Delete'} title="Delete this activity?"/>}

          {this.state.editing
            ? <Textarea ref="descriptionInput" onChange={this.handleChange} value={this.state.editedText} className={`history-text-area`}/>
            : <div className={`font-medium font-normal`}>{this.props.trackable.note}</div>}

        </div>
        {this.state.showControls && <ActivityControlsBar>
          <button className={`small secondary button ${ !this.state.editing && 'hidden'}`} type="button" onClick={this.toggleEdit}>Cancel</button>
          <button className={`small strong button m-left-sm ${ !this.state.editing && 'hidden'}`} onClick={this.onSave} disabled={this.state.editedText === this.props.trackable.note || this.state.editedText.length == 0}>Save</button>
          <button className={`small warning button ${this.state.editing && 'hidden'}`} type="button" onClick={() => this.setState({showConfirmDialog: true})}>Delete</button>
          <button className={`small secondary button m-left-sm ${this.state.editing && 'hidden'}`} type="button" onClick={this.toggleEdit}>Edit</button>
        </ActivityControlsBar>}
      </div>

    )
  }
}

ActivityContent.propTypes = {
  trackable: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
  showControls: React.PropTypes.bool
};

ActivityContent.defaultProps = {
  showControls: false
}
