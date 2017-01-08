class TextForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelComment = this.cancelComment.bind(this);
    this.state = {
      textValue: this.props.initialValue
    }
  }

  handleChange(event) {
    this.setState({textValue: event.target.value});
  }

  cancelComment() {
    this.props.formDidClose(false, '');
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.formDidClose(true, this.state.textValue);
  }

  render() {
    return (
      <div className="generic-text-form">
        <form onSubmit={this.onSubmit}>
          <Textarea onChange={this.handleChange} value={this.state.value}></Textarea>
          <div className="pull-right action-items top-spacing-normal">
            <MaterialUi.RaisedButton className="mui-raised-button pull-right" style={{
              "height": "26px"
            }} type="submit" label="Save" labelPosition="before" primary={true} icon={< i className = "material-icons white" > keyboard_return < /i>} disableTouchRipple={true}/>
            <MaterialUi.RaisedButton onClick={this.cancelComment} className="mui-gray mui-raised-button pull-right right-spacing-normal" style={{
              "height": "26px"
            }} label="Don't create note" primary={true} disableTouchRipple={true}/>
          </div>
        </form>
        <div className="clearfix"></div>
      </div>
    );
  }

}
TextForm.propTypes = {
  comment: React.PropTypes.string,
  formDidClose: React.PropTypes.func
}

TextForm.defaultProps = {
  initialValue: ''
}
