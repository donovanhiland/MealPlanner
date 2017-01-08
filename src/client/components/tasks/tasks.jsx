class Tasks extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      completedTasks: [],
      incompleteTasks: [],
      showCompleted: false
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleNewTask = this.handleNewTask.bind(this);
    this.setSortedTasks = this.setSortedTasks.bind(this);
    this.handleUndoComplete = this.handleUndoComplete.bind(this);
    this.handleOnComplete = this.handleOnComplete.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.handleDeletedTask = this.handleDeletedTask.bind(this);
    this.handleFocusOnCreateTask = this.handleFocusOnCreateTask.bind(this);
  }

  componentDidMount () {
    dispatcherRegistry.addEventlistener("_NEW_TASK_", this.handleNewTask, this);
    dispatcherRegistry.addEventlistener("_TASK_DELETED_", this.handleDeletedTask, this);

    var self = this;
    this.fetchTasks().then(result => {
      self.setSortedTasks(result);
    });
  }

  handleDeletedTask (task) {
    var tasks = _.union(this.state.completedTasks, this.state.incompleteTasks);
    var filtered = _.filter(tasks, t => {
      return t.id !== task.id;
    });
    this.setSortedTasks(filtered);
  }

  handleOnComplete(task) {
    this.updateTask(task)
    var tasks = _.union(this.state.completedTasks, this.state.incompleteTasks);
    var filtered = _.filter(tasks, t => {
      return t.id !== task.id;
    })
    filtered.push(task);
    this.setSortedTasks(filtered);
  }

  handleUndoComplete(task) {
    this.updateTask(task)
    var tasks = _.union(this.state.completedTasks, this.state.incompleteTasks);
    var filtered = _.filter(tasks, t => {
      return t.id !== task.id;
    })
    filtered.push(task);
    this.setSortedTasks(filtered);
  }

  setSortedTasks(tasks) {
    var tasks = _.groupBy(tasks, task => {
      return task.completed_at !== null;
    });
    completed = _.sortBy(tasks[true], task => {
      return task.completed_at;
    }).reverse();
    incomplete = _.sortBy(tasks[false], task => {
      return task.due_date;
    });

    this.setState({completedTasks: completed, incompleteTasks: incomplete});
  }

  handleNewTask(task) {
    var self = this;

    this.fetchTasks().then(result => {
      self.setSortedTasks(result);
    })
  }

  updateTask(task) {
    var self = this;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/v2/deals/${task.deal_id}/tasks/${task.id}`,
        data: JSON.stringify(task),
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        type: "PATCH",
        success: data => {
          notifyUpdatedTaskWatchers(data);
          refreshActivities();
          resolve(data);
        },
        error: err => {
          reject(err);
          console.error(this.props.url, status, err.toString());
        }
      });
    })

  }

  fetchTasks() {
    var self = this;
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: '/api/v2/deals/' + self.props.deal.id + '/tasks',
        contentType: 'json',
        type: 'GET',
        success: function(data) {
          resolve(data);
        }.bind(this),
        error: function(xhr, status, err) {
          reject(err);
        }.bind(this)
      });
    });
  }

  handleFocusOnCreateTask() {
    // $("html, body").animate({
    //   scrollTop: 0
    // }, "slow");
    dispatcherRegistry.dispatch("_CREATE_TASK_FOCUS_");
  }

  render() {

    var completedTaskNodes = _.map(this.state.completedTasks, task => {
      return (
        <TaskItem
          key={task.id}
          showDealLink={false}
          deal={this.props.deal}
          currentUser={this.props.currentUser}
          task={task}
          onComplete={this.handleOnComplete} onUndoComplete={this.handleUndoComplete}
        />
      )
    });

    var incompleteTaskNodes = _.map(this.state.incompleteTasks, task => {
      return (
        <TaskItem
          key={task.id}
          showDealLink={false}
          deal={this.props.deal}
          currentUser={this.props.currentUser}
          task={task}
          onComplete={this.handleOnComplete} onUndoComplete={this.handleUndoComplete}
        />
      )
    });

    emptyState = (
      <div className='empty-state'>No incomplete tasks. Create one
        <span className="link clickable" onClick={this.handleFocusOnCreateTask}>
          &nbsp;here.</span>
      </div>
    )

    completedEmptyState = (
      <div className='empty-state'>No completed tasks</div>
    )

    return (
      <div className="tasks-component card">
        <div className="card-header">Incomplete Tasks
          <div className="pull-right clickable" onClick={this.handleFocusOnCreateTask}>&emsp;|&emsp;New task</div>
          <div className="pull-right clickable" onClick={() => {
            this.setState({
              showCompleted: !this.state.showCompleted
            })
          }}>{this.state.showCompleted
            ? 'Hide completed'
          : 'Show completed'}</div>
        </div>
        <ReactCSSTransitionGroup transitionName="task" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {incompleteTaskNodes}
        </ReactCSSTransitionGroup>
        {this.state.incompleteTasks.length === 0 && emptyState}

        {this.state.showCompleted && <div className='card-header'>Completed Tasks</div>}
        <ReactCSSTransitionGroup transitionName="task" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {this.state.showCompleted && completedTaskNodes}
        </ReactCSSTransitionGroup>
        {this.state.completedTasks.length === 0 && this.state.showCompleted && completedEmptyState}
      </div>
    )
  }
}

Tasks.propTypes = {
  tasks: React.PropTypes.array,
  deal: React.PropTypes.object.isRequired,
  userId: React.PropTypes.number
};

Tasks.defaultProps = {
  defaultTasks: []
}
