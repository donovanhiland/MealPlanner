class TaskFormInputs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      note: props.task
        ? props.task.note
        : '',
      isSaving: false,
      taskType: props.task
        ? props.task.task_type
        : null,
      dueDate: props.task
        ? new Date(props.task.due_date)
        : null,
      task: props.task,
      datePickerOpen: false
    };

    this.handleAssigneeChange = this.handleAssigneeChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.handletaskTypeChange = this.handletaskTypeChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.updateValidation = this.updateValidation.bind(this);
    this.onDatePickerFocus = this.onDatePickerFocus.bind(this);
    this.onDatePickerToggle = this.onDatePickerToggle.bind(this);
    this.onDatePickerBlur = this.onDatePickerBlur.bind(this);
    this.onDatePickerSelect = this.onDatePickerSelect.bind(this);
    this.createTaskFocus = this.createTaskFocus.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) {
      this.updateValidation();
    }
  }

  updateValidation() {
    var isValid = this.state.note.length > 0 && this.state.taskType !== null && this.state.dueDate !== null && !this.state.isSaving;
    if (this.state.originalTask && !this.state.isSaving) {
      var original = this.state.originalTask;

      if (original.note === this.state.note || original.dueDate === this.state.dueDate || original.taskType === this.state.taskType) {
        isValid = false;
      }
    }
    this.props.validationChange(isValid);
  }

  handleDateChange(date) {
    this.setState({dueDate: date});
  }

  handleNoteChange(event) {
    this.setState({note: event.target.value});
  }

  handleAssigneeChange(assignee) {
    this.setState({assignee: assignee});
  }

  onSave() {
    var dueDate = moment(this.state.dueDate);
    var self = this;
    this.setState({isSaving: true});
    var task = {
      note: this.state.note,
      creator_id: this.props.currentUser.id,
      assignee_id: this.props.currentUser.id,
      task_type: this.state.taskType.value,
      due_date: dueDate.utc().format()
    }
    this.postNewTask(task).then(result => {
      notifyNewActionWatchers(result);
      notifyNewTaskWatchers(result);
      setTimeout(() => {
        self.setState({isSaving: false, note: '', taskType: null, dueDate: null});
      }, 500);
    });
  }

  update() {
    var self = this;

    return new Promise((resolve, reject) => {
      var dueDate = moment(this.state.dueDate);
      self.setState({isSaving: true});
      var task = {
        id: self.props.task.id,
        note: self.state.note,
        task_type: self.state.taskType.value || self.state.taskType,
        due_date: dueDate.utc().format(),
        completed_at: self.props.task.completed_at,
        deal_id: this.props.deal.id
      }
      this.updateTask(task).then(result => {
        resolve(result);
      });
    });

  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_CREATE_TASK_FOCUS_", this.createTaskFocus, this);
    var self = this;
    var currentUser = this.props.currentUser;
    // this.loadUsers().then(result => {
    //   users = _.map(result, usr => {
    //     return {value: usr.id, label: `${usr.first_name} ${usr.last_name}`};
    //   });
    //   users = _.reject(users, usr => {
    //     return usr.value === self.props.currentUser.id;
    //   });
    //   assignee = {
    //     value: currentUser.id,
    //     label: `${currentUser.first_name} ${currentUser.last_name}`
    //   };
    //   users.unshift(assignee);
    //   self.setState({options: users, assignee: assignee});
    // });
  }

  handletaskTypeChange(activity) {
    this.setState({taskType: activity});
  }

  loadUsers() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/v2/users',
        contentType: 'application/json',
        cache: false,
        type: "GET",
        success: data => {
          resolve(data);
        },
        error: error => {
          reject(error);
        }
      });
    });
  }

  postNewTask(task) {
    var self = this;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/v2/deals/${self.props.deal.id}/tasks`,
        data: JSON.stringify({task: task}),
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        type: "POST",
        success: data => {
          resolve(data);
        },
        error: error => {
          console.error(error.responseText);
          reject(error);
        }
      });
    });
  }

  updateTask(task) {
    var self = this;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/v2/deals/${self.props.deal.id}/tasks/${task.id}`,
        data: JSON.stringify({task: task}),
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        type: "PATCH",
        success: data => {
          notifyUpdatedResourceWatchers(task, 'task');
          resolve(task);
        },
        error: error => {
          console.error(error.responseText);
          reject(error);
        }
      });
    });
  }

  onDatePickerFocus() {
    this.setState({datePickerOpen: 'calendar'});
  }

  onDatePickerBlur() {
    this.setState({
      datePickerOpen: false
    }, () => {
      this.taskTextArea.focus();
    });
  }

  onDatePickerSelect() {
    this.setState({
      datePickerOpen: false
    }, () => {
      this.taskTextArea.focus();
    });
  }

  onDatePickerToggle() {}

  createTaskFocus() {
    console.log('focus on select');
    setTimeout(() => {
      this.activitySelect.focus();
    }, 300)

  }

  render() {
    return (
      <div className="task-form-inputs-component">

        <div className="task-form-inputs-top-row row m-x-0">
          <div className="add-task-select-activity-container col-xs-6 p-x-0">
            <Select ref={(select) => {
              this.activitySelect = select;
            }} className="" placeholder="Select a task type..." value={this.state.taskType} options={this.props.activities} onChange={this.handletaskTypeChange} openOnFocus={true}/>
          </div>
          <div className="add-task-date-time-picker-container col-xs-6 p-x-0">
            <DateTimePicker onFocus={this.onDatePickerFocus} onBlur={this.onDatePickerBlur} onSelect={this.onDatePickerSelect} time={false} value={this.state.dueDate} onChange={this.handleDateChange} min={new Date()} open={this.state.datePickerOpen} onToggle={this.onDatePickerToggle}></DateTimePicker>
          </div>
        </div>
        <div className="history-divider"></div>

        {this.state.remove_this_when_adding_assignees && <div>
          <div className="p-xy-med row m-x-0">
            <div className='pull-left assign-lable'>Assign to:</div>
            <Select className="assignee-select pull-left" placeholder="Select an assignee..." value={this.state.assignee} options={this.state.options} onChange={this.handleAssigneeChange}/>
          </div>

          <div className="history-divider"></div>
        </div>}

        <div className="">
          {this.props.task && <Validation.components.Form>
            <BrixioTextarea value={this.state.note} onChange={this.handleNoteChange} name="task_description" placeholder="Task description" validations={[]}/>
          </Validation.components.Form>}

          {!this.props.task && <div className="p-xy-med">
            <Textarea ref={(taskTextArea) => {
              this.taskTextArea = taskTextArea;
            }} placeholder='Describe the task...' value={this.state.note} className="history-text-area" onChange={this.handleNoteChange}/>
          </div>}

        </div>

      </div>
    )
  }
}

TaskFormInputs.propTypes = {
  currentUser: React.PropTypes.object.isRequired,
  deal: React.PropTypes.object.isRequired,
  validationChange: React.PropTypes.func,
  task: React.PropTypes.object
};

TaskFormInputs.defaultProps = {
  task: null,
  activities: [
    {
      value: 'phone_call',
      label: 'Phone call'
    }, {
      value: 'email',
      label: 'Send email'
    }, {
      value: 'todo',
      label: 'To-do'
    }
  ]
}
