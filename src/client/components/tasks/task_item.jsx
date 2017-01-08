class TaskItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      task: props.task,
      showControls: false,
      showConfirmDialog: false,
      height: null,
      editing: false,
      editIsValid: false,
      needsStyleReset: true,
      descriptionExpanded: false,
      descriptionExpanding: false,
      descriptionOverflowing: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.calcStyles = this.calcStyles.bind(this);
    this.handleValidationChange = this.handleValidationChange.bind(this);
    this.handleCancelEditing = this.handleCancelEditing.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.handleUpdatedTask = this.handleUpdatedTask.bind(this);
    this.onDescriptionClick = this.onDescriptionClick.bind(this);
    this.handleMoreButtonTouched = this.handleMoreButtonTouched.bind(this);
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_TASK_UPDATED_", this.handleUpdatedTask, this);
    dispatcherRegistry.addEventlistener("_TASK_MORE_TOUCHED_", this.handleMoreButtonTouched);
  }

  handleMoreButtonTouched(taskItem) {
    var showControls = false;
    if (this === taskItem) {
      showControls = !this.state.showControls;
    }
    this.setState({showControls: showControls});
  }

  handleUpdatedTask(task) {
    if (this.state.task.id === task.id) {
      this.setState({task: task});
    }
  }

  handleCancelEditing() {
    this.setState({editing: false, showControls: false, editIsValid: false});
  }

  onUpdate() {
    var self = this;
    this.refs.taskForm.update().then(result => {
      self.setState({editing: false, showControls: false, needsStyleReset: true, descriptionExpanded: false, height: 40});
    });
  }

  toggleEdit() {
    this.setState({editing: true});
  }

  handleValidationChange(value) {
    this.setState({editIsValid: value});
  }

  handleChange(event) {
    var task = this.state.task;
    if (task.completed_at) {
      task.completed_at = null;
      task.completor_id = null;
      this.props.onUndoComplete(task)
    } else {
      task.completed_at = moment.utc().format();
      task.completor_id = this.props.currentUser.id;
      this.props.onComplete(task)
    }
    this.setState({task: task});
  }

  confirmDelete() {
    this.setState({showConfirmDialog: false});
    this.deleteTask(this.state.task.deal_id, this.state.task).then(() => {
      
    });
  }

  deleteTask(deal_id, task) {
    var self = this;
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/api/v2/deals/' + deal_id + '/tasks/' + task.id,
        type: 'DELETE',
        success: function () {
          notifiyDeletedResourceWatchers(self.state.task, "task");
          resolve();
        }.bind(this),
        error: function (xhr, status, err) {
          reject(err);
        }.bind(this)
      });
    });
  }

  calcStyles(node) {
    if (node && this.state.needsStyleReset) {
      let desc = node.getElementsByClassName('task-description')[0];
      let descriptionOverflowing = desc
        ? desc.scrollWidth > desc.offsetWidth
        : false;

      this.setState({needsStyleReset: false, height: node.offsetHeight, descriptionOverflowing});
    }
  }

  onDescriptionClick(event) {
    event.preventDefault();
    if (!this.state.descriptionOverflowing || this.state.showControls) {
      return false;
    }

    this.setState({
      descriptionExpanded: !this.state.descriptionExpanded,
      descriptionExpanding: !this.state.descriptionExpanding
    }, () => {
      // Need to get the height after it's been adjusted
      let height = this.rowNode.offsetHeight;
      this.setState({height, descriptionExpanding: false});
    });

  }

  render() {

    let buttons = (
      <div className="buttons-section">
        <button disabled={!this.state.editIsValid} className="button pull-right strong" onClick={this.onUpdate}>Update Task</button>
        <button className="button secondary pull-right" onClick={this.handleCancelEditing}>Cancel</button>
      </div>
    );

    let prefix = "";
    switch (this.state.task.task_type) {
      case 'phone_call':
        prefix = "Phone Call: "
        break;
      case 'meeting':
        prefix = "Meeting: "
        break;
      case 'email':
        prefix = "Email: "
        break;
      case 'other':
        prefix = ""
        break;
      default:
        prefix = ""
        break;
    }

    var isOverDue = moment().diff(moment(this.state.task.due_date), 'days') > 0;

    const taskDeal = this.state.task.deal;

    return (
      <div className={`task-row row m-xy-0 ${this.state.descriptionExpanded ? 'expanded' : ''} ${this.state.descriptionExpanding ? 'expanding' : ''}`} ref={(node) => {
        this.rowNode = node;
        this.calcStyles(node);
      }} style={{
        height: this.state.height
      }}>
        {this.state.editing && <BrixioModal title="Edit Task" onClose={this.handleCancelEditing} buttons={buttons}>
          <TaskFormInputs ref='taskForm' task={this.state.task} isEditing={true} currentUser={this.props.currentUser} deal={this.props.deal} validationChange={this.handleValidationChange}></TaskFormInputs>
        </BrixioModal>}

        {this.state.showConfirmDialog && <ConfirmDialog message={'Are you sure you want to delete this task?'} cancelAction={() => this.setState({showConfirmDialog: false, showControls: false})} confirmAction={this.confirmDelete} confirmButtonText={'Delete'} title="Delete this task?"/>}

        <input disabled={this.state.showControls} className="task-checkbox" type="checkbox" checked={this.state.task.completed_at != null} value={this.state.task.completed_at != null} onChange={this.handleChange}></input>

        {
          this.props.showDealLink ? <button className="button small task-deal-button row-item-spacing" href={`/deals/${taskDeal.id}`}>
            {taskDeal.person.full_name}
          </button> : null
        }

        <div className={`task-description ${this.state.task.completed_at != null && ' completed'} ${this.state.showControls && ' disabled'} ${this.state.descriptionOverflowing
          ? 'overflowing'
        : ''}`} onClick={this.onDescriptionClick}>
          <span className="task-prefix">{prefix}</span>
          {this.state.task.note}</div>

        <div className={`task-info-section ${this.state.showControls && 'disabled'}`}>

          <div className={`task-due-date ${isOverDue
            ? 'warn'
          : ''}`}>{moment(this.state.task.due_date).format('L')}</div>
        </div>

        <div className={`task-controls ${this.state.showControls && ' open'}`}>

          <button className={`small warning button ${this.state.editing && 'hidden'}`} type="button" onClick={() => this.setState({showConfirmDialog: true})}>Delete</button>

          <button className={`small secondary button m-left-sm ${this.state.editing && 'hidden'}`} type="button" onClick={this.toggleEdit}>Edit</button>
        </div>

        <i className="material-icons more-button" onClick={() => {
          dispatcherRegistry.dispatch("_TASK_MORE_TOUCHED_", this);
        }}>{this.state.showControls
          ? 'close'
        : 'more_vert'}</i>

      </div>
    )
  }
}

TaskItem.propTypes = {
  task: React.PropTypes.object.isRequired,
  onComplete: React.PropTypes.func,
  onUndoComplete: React.PropTypes.func,
  userId: React.PropTypes.number,
  deal: React.PropTypes.object.isRequired
};
