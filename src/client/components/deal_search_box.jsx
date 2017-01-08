class DealSearchBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    dispatcherRegistry.dispatch("_NEW_SEARCH_TERM_", this.state.searchTerm);
    if (this.state.searchTerm == "") {
      $("#deal-search-form").removeClass("has-text");
    } else {
      $("#deal-search-form").addClass("has-text");
    }
  }

  handleTermChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  handleClearClick(e) {
    e.preventDefault();

    this.setState({
      searchTerm: ""
    }, () => dispatcherRegistry.dispatch("_NEW_SEARCH_TERM_", this.state.searchTerm));

    $("#deal-search-form").removeClass("has-text");
  }

  componentDidMount() {}

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="deal-search-box" id="deal-search-form">
        <a className="clear-deal-search-button" onClick={this.handleClearClick}>
          <i className="material-icons clear-search-icon">close</i>
          Clear Filters
        </a>
        <i className="material-icons search-icon">search</i>
        <input type="text" name="deal-search-term" value={this.state.searchTerm} onChange={this.handleTermChange} placeholder="Search All Deals"/>
      </form>
    )
  }
}
