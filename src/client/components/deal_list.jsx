class DealList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deals: props.initialDeals,
      sortBy: "created_at",
      sortDirection: "desc",
      arrowClass: "arrow-up",
      searchTerm: "",
      isFetching: true,
      loadSize: 50,
      currentPage: 0,
      hasMoreToLoad: true
    };
    this.handleSortClick = this.handleSortClick.bind(this);
    this.fetchDeals = this.fetchDeals.bind(this);
    this.handleNewSearchTerm = this.handleNewSearchTerm.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleSortClick(e) {
    var sortDirection;
    var sortValue = $(e.target).data("sort");
    if (sortValue == this.state.sortBy) {
      // If we are on the same sort value change it, else start with 'asc'
      sortDirection = this.state.sortDirection == "asc"
        ? "desc"
        : "asc";
    } else {
      sortDirection = 'desc';
    }

    var arrowClass = sortDirection == "desc"
      ? "arrow-up"
      : "arrow-down";

    this.setState({
      sortBy: sortValue,
      sortDirection: sortDirection,
      arrowClass: arrowClass,
      deals: [],
      currentPage: 0
    }, () => this.fetchDeals());
  }

  loadMore() {
    if (!this.state.hasMoreToLoad) {
      console.log("none left to fetch");
      return;
    }
    if (this.state.isFetching) {
      console.log("hold up, fetching in process...")
      return;
    }
    console.log("Loading more: " + Date.now());
    this.setState({
      isFetching: true
    }, () => this.fetchDeals(true));
  }

  fetchDeals(shouldAppend = false) {

    console.log("fetching deals: " + Date.now());
    this.setState({isFetching: true});

    // Formated this way, instead of "match_all" so we can append an org/user id on the server to policy scope it
    // In this case, we assume all deals have a '0' somewhere in the document
    let term = this.state.searchTerm;
    this.state.searchTerm = (typeof term === 'string' && term.trim() !== "")
      ? term
      : 0;

    var query = {
      "bool": {
        "must": [
          {
            "match": {
              "_all": this.state.searchTerm
            }
          }
        ]
      }
    };

    var data = {};
    data.elasticsearch_request = {};
    data.elasticsearch_request.size = this.state.loadSize;
    data.elasticsearch_request.from = (this.state.loadSize * this.state.currentPage);
    data.elasticsearch_request.query = query;

    var sortObject = {};
    var sortDirection = {};
    sortDirection.order = this.state.sortDirection;
    sortObject[this.state.sortBy] = sortDirection;

    data.elasticsearch_request.sort = [sortObject];

    $.ajax({
      url: '/api/v2/deals',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json',
      cache: false,
      type: "POST",
      success: (data) => {
        let hasMoreToLoad = data.length == 0
          ? false
          : true;
        let newDeals = shouldAppend
          ? this.state.deals.concat(data)
          : data;
        this.setState({
          deals: newDeals,
          isFetching: false,
          hasMoreToLoad: hasMoreToLoad,
          currentPage: this.state.currentPage + 1
        });

      },
      error: (xhr, status, err) => {
        this.setState({isFetching: false});
        console.error(this.props.url, status, err.toString());
      }
    });

  }

  handleNewSearchTerm(term) {
    this.setState({
      searchTerm: term,
      deals: [],
      currentPage: 0
    }, () => this.fetchDeals());
  }

  componentDidMount() {
    dispatcherRegistry.addEventlistener("_NEW_SEARCH_TERM_", this.handleNewSearchTerm, this);
    if (this.props.infiniteScroll) {
      // TODO : probably should have a global spot for all global window events like this and then trigger
      // dispatch events or something...
      window.addEventListener('scroll', this.handleScroll);
    }

    this.fetchDeals();
  }

  componentDidUnMount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      console.log("bottom reached");
      this.loadMore();
    }
  }

  render() {
    var self = this;
    var dealNodes = this.state.deals.map(function(deal) {
      return (
        <Deal key={deal.id} deal={deal} currentUserRole={self.props.currentUserRole} currentUserOrgRole={self.props.currentUserOrgRole}></Deal>
      )
    });
    return (
      <div className="container flush-sides">
        <table className="table deal-list">
          <thead>
            <tr className="sort">
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="created_at" data-sort-direction={this.state.sortDirection}>Created</span>
                <span style={this.state.sortBy == "created_at"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th className={(this.props.currentUserRole == "overlord")
                ? ""
              : "hidden"}>
                <span className="text" onClick={this.handleSortClick} data-sort="organization.name.raw" data-sort-direction={this.state.sortDirection}>Organization</span>
                <span style={this.state.sortBy == "organization.name.raw"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th className={(this.props.currentUserRole == "overlord" || this.props.currentUserOrgRole == "admin" || this.props.currentUserOrgRole == "manager")
                ? ""
              : "hidden"}>
                <span className="text" onClick={this.handleSortClick} data-sort="user.first_name.raw" data-sort-direction={this.state.sortDirection}>Agent</span>
                <span style={this.state.sortBy == "user.first_name.raw"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="person.first_name.raw" data-sort-direction={this.state.sortDirection}>Contact</span>
                <span style={this.state.sortBy == "person.first_name.raw"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="asset_type.name.raw" data-sort-direction={this.state.sortDirection}>Asset Type</span>
                <span style={this.state.sortBy == "asset_type.name.raw"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="deal_type.raw" data-sort-direction={this.state.sortDirection}>Deal Type</span>
                <span style={this.state.sortBy == "deal_type.raw"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="square_feet" data-sort-direction={this.state.sortDirection}>Sq Ft</span>
                <span style={this.state.sortBy == "square_feet"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="budget" data-sort-direction={this.state.sortDirection}>Budget</span>
                <span style={this.state.sortBy == "budget"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="address.city.raw" data-sort-direction={this.state.sortDirection}>Location</span>
                <span style={this.state.sortBy == "address.city.raw"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="current_stage.name.raw" data-sort-direction={this.state.sortDirection}>Stage</span>
                <span style={this.state.sortBy == "current_stage.name.raw"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th>
                <span className="text" onClick={this.handleSortClick} data-sort="status.raw" data-sort-direction={this.state.sortDirection}>Status</span>
                <span style={this.state.sortBy == "status.raw"
                  ? {
                    display: 'inline-block'
                  }
                  : {}} className={this.state.arrowClass}></span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dealNodes}
          </tbody>
        </table>
        <div className={(!this.state.isFetching && this.state.deals.length == 0)
          ? 'no-deals-message'
        : 'hidden'}>No Results</div>

        <div className={this.state.isFetching
          ? 'loading-spinner-wrapper list-loader'
        : 'loading-spinner-wrapper list-loader hidden'}>
          <span className="loading-spinner">
            <div className="dots">
              <i className="one"></i>
              <i className="two"></i>
              <i className="three"></i>
            </div>
          </span>
        </div>
      </div>
    )
  }
}

DealList.propTypes = {
  deals: React.PropTypes.array,
  currentUserRole: React.PropTypes.string,
  currentUserOrgRole: React.PropTypes.string
};
DealList.defaultProps = {
  initialDeals: []
};;
