class HistorySpacer extends React.Component {

  render() {
    return (
      <div className="col-xs-12 p-x-0 history-row">
        <ActivityConnect isLast={false}/>
        <div className="col-xs-11 p-x-0" style={{
          'height': '10px'
        }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
