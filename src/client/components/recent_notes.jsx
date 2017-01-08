class RecentNotes extends React.Component {

  constructor(props) {
    super(props);
    this.addNoteToStore = this.addNoteToStore.bind(this);
    this.handleNewNoteClick = this.handleNewNoteClick.bind(this);
    this.state = {
      notes: props.initialNotes,
      isCreating: false
    };
  }

  addNoteToStore(note) {
    var notes = this.state.notes;
    notes.unshift(note);
    this.setState({notes: notes, isCreating: false});
  }

  handleNewNoteClick() {
    this.setState({
      isCreating: !this.state.isCreating
    });
  }

  componentDidMount() {

    dispatcherRegistry.addEventlistener("_ADD_NOTE_", this.addNoteToStore, this);
    $.ajax({
      url: '/api/v2/deals/' + this.props.dealId + '/notes',
      dataType: 'json',
      contentType: 'application/json',
      cache: false,
      type: "GET",
      success: function(data) {
        this.setState({notes: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  render() {

    var buttonClassName = this.state.isCreating
      ? 'rotated'
      : 'not-rotated';
    return (
      <div className="content-frameless notes">
        <div className="header">
          <span>Deal Updates</span>
          <div onClick={this.handleNewNoteClick} className="pull-right add-note">
            <i className={'material-icons' + ' ' + buttonClassName}>add</i>
          </div>
        </div>
        <div className="content">
          <div className={this.state.isCreating
            ? 'new-note-wrapper active'
            : 'new-note-wrapper inactive'}>
            <NewNote isCreating={this.state.isCreating} user={this.props.user} dealId={this.props.dealId}></NewNote>
          </div>
          <div className="clear-fix"></div>
        </div>
      </div>
    )
  }
}

RecentNotes.propTypes = {
  notes: React.PropTypes.array,
  dealId: React.PropTypes.number,
  user: React.PropTypes.object
};
RecentNotes.defaultProps = {
  initialNotes: []
};
