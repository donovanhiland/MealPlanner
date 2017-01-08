class AgendaListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      task: props.task,
      showControls: false,
      editing: false
    };
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

  handleMoreButtonTouched(taskItem) {
    var showControls = false;
    if (this === taskItem) {
      showControls = !this.state.showControls;
    }
    this.setState({showControls: showControls});
  }

  render() {

    const taskDeal = this.state.task.deal;

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

    return (
      <div className="agenda-list-item card">
        <div className="card-content">
          <div
            className="agenda-row"
            ref={(node) => {
              this.rowNode = node;
              this.calcStyles(node);
            }}
            style={{height: this.state.height}}
          >
            <input
              className="row-item-spacing"
              type="checkbox"/>

            <button className="button small task-deal-button row-item-spacing" href={`/deals/${taskDeal.id}`}>
              {taskDeal.person.full_name}
            </button>

            <div
              className="agenda-row-description row-item-spacing"
              onClick={this.onDescriptionClick}
            >
              <span className="agenda-task-prefix">{prefix}</span>
              {this.state.task.note}
            </div>

            <div className={`row-item-spacing ${this.state.showControls && 'disabled'}`}>
              <div className={`task-due-date ${ isOverDue ? 'warn' : ''}`}>
                {moment(this.state.task.due_date).format('L')}
              </div>
            </div>

            <div className={`task-controls ${this.state.showControls && 'open'}`}>
              <button
                className={`small warning button ${this.state.editing && 'hidden'}`} type="button"
                onClick={() => this.setState({showConfirmDialog: true})}
              >
                Delete
              </button>
              <button
                className={`small secondary button m-left-sm ${this.state.editing && 'hidden'}`}
                type="button"
                onClick={this.toggleEdit}
              >
                Edit
              </button>
            </div>

            <i
              className="material-icons agenda-more-button pull-right"
              onClick={() => this.handleMoreButtonTouched(this)}
            >
              {this.state.showControls
                ? 'close'
              : 'more_vert'}
            </i>
          </div>
        </div>
      </div>
    )
  }

}
