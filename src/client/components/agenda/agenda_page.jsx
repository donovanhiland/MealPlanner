class AgendaPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="agenda-page">
        <AgendaSubNav/>
        <AgendaList userId={this.props.userId} />
      </div>
    )
  }

}
