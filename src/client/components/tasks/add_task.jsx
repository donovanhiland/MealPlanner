class AddTask extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      isValid: false
    };
    this.onSave = this.onSave.bind(this);
    this.handleValidationChange = this.handleValidationChange.bind(this);
  }

  onSave() {
    this.refs.taskForm.onSave();
  }

  handleValidationChange(value) {
    this.setState({isValid: value});
  }

  render() {
    return (
      <div className="add-task-component row m-x-0">

        <div className="col-xs-12 p-x-0 card">
          <TaskFormInputs ref='taskForm' currentUser={this.props.currentUser} deal={this.props.deal} validationChange={this.handleValidationChange}></TaskFormInputs>

          <ActivityControlsBar>
            <button className='small strong button' type="button" onClick={this.onSave} disabled={!this.state.isValid}>Create Task</button>
            {this.state.isSaving && <div className="task-saving-loader">
              <Loader/>
            </div>}
          </ActivityControlsBar>
        </div>

      </div>
    )
  }
}

AddTask.propTypes = {
  tabName: React.PropTypes.string,
  tabIcon: React.PropTypes.string,
  currentUser: React.PropTypes.object.isRequired,
  deal: React.PropTypes.object.isRequired
};

AddTask.defaultProps = {
  tabName: 'Add Task',
  tabIcon: 'done'
}
