class AgendaList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    $.ajax({
      url: `/api/v2/users/${this.props.userId}/tasks`,
      dataType: 'json',
      contentType: 'application/json',
      cache: false,
      type: 'GET',
      success: (data) => {
        this.setState({
          tasks: data,
        });
      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      },
    });
  }

  handleDeletedTask(task) {
    const tasks = _.union(this.state.completedTasks, this.state.incompleteTasks);
    const filtered = _.filter(tasks, t => t.id !== task.id);
    this.setSortedTasks(filtered);
  }

  handleOnComplete(task) {
    this.updateTask(task);
    const tasks = _.union(this.state.completedTasks, this.state.incompleteTasks);
    const filtered = _.filter(tasks, t => t.id !== task.id);
    filtered.push(task);
    this.setSortedTasks(filtered);
  }

  handleUndoComplete(task) {
    this.updateTask(task);
    const tasks = _.union(this.state.completedTasks, this.state.incompleteTasks);
    const filtered = _.filter(tasks, t => t.id !== task.id)
    filtered.push(task);
    this.setSortedTasks(filtered);
  }

  render() {

    const taskList = this.state.tasks.map(task =>
      <TaskItem
        key={task.id}
        showDealLink={true}
        deal={task.deal}
        currentUser={this.props.userId}
        task={task}
        onComplete={this.handleOnComplete}
        onUndoComplete={this.handleUndoComplete}
      />
    );

    return (
      <div className="tasks-component container" style={{ marginTop: 40 }}>
        { taskList }
      </div>
    );
  }
}
