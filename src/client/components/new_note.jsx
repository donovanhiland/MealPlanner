class NewNote extends React.Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: "",
      saving: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isCreating) {
      this.setState({value: ""});
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className="row note no-gutter">
          <div className="float-left">
            <Avatar user={this.props.user} size="small"></Avatar>
          </div>
          <div className="float-left details">
            <span className="font-small light">{this.props.user.first_name} {this.props.user.last_name}</span>
            <i className="note-time material-icons pull-right">access_time</i>
            <span className="pull-right tiny lightest time-label">Right now</span>
            <br></br>
            <Textarea onChange={this.handleChange} value={this.state.value}></Textarea>
            <div className="pull-right action-items">
              <MaterialUi.RaisedButton className="mui-raised-button pull-right" style={{
                "height": "26px"
              }} type="submit" disabled={this.state.saving} label="Save" labelPosition="before" primary={true} icon={< i className = "material-icons white" > keyboard_return < /i>} disableTouchRipple={true}/>
            </div>
          </div>
        </div>
      </form>
    );
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({saving: true});

    var note = {
      user_id: this.props.user.id,
      deal_id: this.props.dealId,
      text: this.state.value
    };

    var self = this;
    publishNote(note).then(result => {
      notifyNewNoteWatchers(result);
      self.setState({value: "", saving: false});
    }, error => {
      this.setState({saving: false});
      console.error(self.props.url, error.toString());
    });
  }
}

NewNote.propTypes = {
  user: React.PropTypes.object,
  value: React.PropTypes.string,
  dealId: React.PropTypes.number,
  isCreating: React.PropTypes.bool
};
