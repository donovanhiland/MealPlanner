class AgendaSubNav extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="sub-nav-component">
        <div className="container">
          <div className="sub-nav-title pull-left">Agenda</div>
          <div className="sub-nav-button pull-right">
            <div style={{marginRight: 20, display: "inline-block"}}>
              {/* <AgendaSort/> */}
            </div>
            <button className="button secondary">
              + New Task
            </button>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }

}
