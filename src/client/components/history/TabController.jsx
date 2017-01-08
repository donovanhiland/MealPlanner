class TabController extends React.Component {

  constructor(props) {
    super(props);
    var selectedTab = ''
    React.Children.forEach(props.children, (child, idx) => {
      if (idx === 0) {
        selectedTab = toSnakeCase(child.props.tabName);
      }
    });

    this.state = {
      selectedTab: selectedTab
    }
    this.handleTabClick = this.handleTabClick.bind(this);
    this.createTaskFocus = this.createTaskFocus.bind(this);
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_CREATE_TASK_FOCUS_", this.createTaskFocus, this);
  }

  handleTabClick(tabName) {
    if (this.state.selectedTab !== tabName) {
      this.setState({selectedTab: tabName});
    }
  }

  createTaskFocus() {
    this.setState({selectedTab: toSnakeCase("Add Task")});
  }

  render() {
    var self = this;
    var tabList = React.Children.map(this.props.children, function(child, idx) {
      var name = child.props.tabName
        ? child.props.tabName
        : 'Tab';
      return (
        <li onClick={() => {
          self.handleTabClick(toSnakeCase(child.props.tabName))
        }} data-name={`${toSnakeCase(child.props.tabName)}`} className={`history-tab ${self.state.selectedTab === toSnakeCase(child.props.tabName)
          ? 'selected'
          : 'font-medium'}`}>
          <div className="tab-shadow-cover"/> {child.props.tabIcon && <i className="material-icons">{child.props.tabIcon}</i>}
          <span>{child.props.tabName}</span>
        </li>
      )
    });

    var childrenList = React.Children.map(this.props.children, (child, idx) => {
      return (
        <div className={toSnakeCase(child.props.tabName) !== self.state.selectedTab && 'hidden'}>{child}</div>
      )
    });

    return (
      <div className="tab-controller-component">
        <ol className="tab-controller-tabs">{tabList}</ol>
        <div className="tab-controller-children">
          {childrenList}
        </div>

      </div>
    )
  }
}

TabController.propTypes = {};

TabController.defaultProps = {}
