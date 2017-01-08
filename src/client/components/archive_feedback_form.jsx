class ArchiveFeedbackForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeReason = this.changeReason.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      commentValue: '',
      reasonCode: '',
      reasons: []
    }
  }

  componentWillMount() {
    $.ajax({
      url: '/api/v2/status_reasons/',
      dataType: 'json',
      contentType: 'application/json',
      cache: false,
      type: "GET",
      success: function(data) {
        this.setState({reasons: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  cancel() {
    this.props.formDidClose(false);
  }

  changeReason(event) {
    this.setState({reasonCode: event.target.value});
  }

  handleChange(event) {
    this.setState({commentValue: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.state.reasonCode === '') {
      alert('Please choose a reason');
    } else {
      this.props.formDidClose(true, this.state.reasonCode, this.state.commentValue);
    }
  }

  render() {
    /* <MaterialUi.RadioButton key={reason.value} value={reason.value} label={reason.name} className="top-spacing-small"/> */

    var reasons = _.map(this.state.reasons, reason => {
      return (
        <div className="archive-reason-row row m-x-0" key={reason.value}>
          <label>
            <input type="radio" name="archive-reasons" value={reason.value} onChange={this.changeReason}/>{reason.name}
          </label>
        </div>
      )
    });

    let buttons = (
      <div className="buttons-section">
        <button className="button pull-right strong" onClick={this.onSubmit}>Submit</button>
        <button className="button secondary pull-right" onClick={this.cancel}>Cancel</button>
      </div>
    );

    return (
      <BrixioModal title="Archive this Deal" subtitle="Choose a reason:" onClose={this.cancel} buttons={buttons}>

        <MuiThemeProvider muiTheme={muiTheme}>

          <Validation.components.Form onSubmit={this.onSubmit} className="archive-feedback-form-component">
            <div className="archive-reasons m-bottom-md">
              {reasons}
            </div>
            <BrixioTextarea value={this.state.commentValue} onChange={this.handleChange} name="additional_notes" placeholder="Additional Notes" validations={[]}/>
            <button type="submit" className="hidden"/>
            <div className="clearfix"></div>
          </Validation.components.Form>

        </MuiThemeProvider>
      </BrixioModal>

    );
  }

}

ArchiveFeedbackForm.propTypes = {
  formDidClose: React.PropTypes.func
}
