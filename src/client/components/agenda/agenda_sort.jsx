class AgendaSort extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className="agenda-date-sort-row">
          <div className="sort-row-item">Today</div>
          <div className="sort-row-item">Tomorrow</div>
          <div className="sort-row-item">This Week</div>
          <div className="sort-row-item active">All</div>
        </div>
      </div>
    )
  }

}
