class MasterDealList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deals: [],
      sortBy: "created_at",
      sortDirection: "desc",
      arrowClass: "arrow-down",
      searchTerm: "",
      isAssigned: props.isAssigned,
      isFetching: true,
      loadSize: 25,
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
      sortDirection = this.state.sortDirection == "desc"
        ? "asc"
        : "desc";
    } else {
      sortDirection = 'asc';
    }

    var arrowClass = sortDirection == "asc"
      ? "arrow-down"
      : "arrow-up";

    this.setState({
      sortBy: sortValue,
      sortDirection: sortDirection,
      arrowClass: arrowClass
    }, () => this.fetchDeals());
  }

  fetchDeals(shouldAppend = false) {
    console.log("fetching deals: " + Date.now());
    this.setState({isFetching: true});

    let term = this.state.searchTerm;
    var query = {};

    if (this.props.isAssigned) {
      if (typeof term === 'string' && term.trim() != "") {
        query = {
          "bool": {
            "must": [
              {
                "match": {
                  "_all": term
                }
              }, {
                "range": {
                  "deals_count": {
                    "gt": 0
                  }
                }
              }
            ]
          }
        }
      } else {
        query = {
          "range": {
            "deals_count": {
              "gt": 0
            }
          }
        }
      }

    } else {
      if (typeof term === 'string' && term.trim() != "") {
        query = {
          "bool": {
            "must": [
              {
                "match": {
                  "_all": term
                }
              }, {
                "range": {
                  "deals_count": {
                    "lt": 1
                  }
                }
              }
            ]
          }
        }
      } else {
        query = {
          "range": {
            "deals_count": {
              "lt": 1
            }
          }
        }
      }
    }

    var data = {};
    data.elasticsearch_request = {};
    data.elasticsearch_request.size = this.state.loadSize;
    data.elasticsearch_request.from = (this.state.loadSize * this.state.currentPage);
    data.elasticsearch_request.query = query;

    var sortObject = {};
    var sortDirection = {};
    sortDirection["order"] = this.state.sortDirection;
    sortObject[this.state.sortBy] = sortDirection;

    data.elasticsearch_request.sort = [sortObject];

    var self = this;
    $.ajax({
      url: '/api/v2/master_deals',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json',
      cache: false,
      type: "POST",
      success: function(data) {
        let hasMoreToLoad = data.length == 0
          ? false
          : true;
        let newDeals = shouldAppend
          ? self.state.deals.concat(data)
          : data;
        self.setState({
          deals: newDeals,
          isFetching: false,
          hasMoreToLoad: hasMoreToLoad,
          currentPage: this.state.currentPage + 1
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(self.props.url, status, err.toString());
        self.setState({isFetching: false, hasMoreToLoad: false});
      }.bind(self)
    });

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
      var location = deal.desired_location || (deal.address
        ? deal.address.city
        : "Unknown");
      var assetType = deal.asset_type
        ? deal.asset_type.name
        : "Unknown";
      var budget = !deal.budget || deal.budget == 0
        ? "Unknown"
        : numeral(deal.budget).format('$0,0');
      if (deal.budget == -1) {
        budget = "Unlimited";
      }
      var squareFeet = !deal.square_feet || deal.square_feet == 0
        ? "Unknown"
        : numeral(deal.square_feet).format('0,0');
      return (
        <MasterDeal key={deal.id} id={deal.id} deals={deal.deals} squareFeet={squareFeet} budget={budget} timeFrame={deal.time_frame} createdAtRaw={deal.created_at} createdAt={moment(deal.created_at).format('MMM DD, \'YY')} contactName={deal.person.name} assetType={assetType} dealType={deal.deal_type} location={location} comment={deal.comment} organizations={self.props.organizations} authenticityToken={self.props.authenticityToken} isAssigned={self.props.isAssigned}></MasterDeal>
      )
    });

    return (
      <div className="container">
        {dealNodes}
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

MasterDealList.propTypes = {
  deals: React.PropTypes.array
};
