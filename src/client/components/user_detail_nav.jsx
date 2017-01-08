class UserDetailNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }

  render() {
    return (
      <div id="sub-nav-component">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className="container">
            <div className="sub-nav-title pull-left">
              <Breadcrumbs breadcrumbs={this.props.breadcrumbs}/>
            </div>
            <div className="clearfix"></div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

DealDetailNav.propTypes = {
  breadcrumbs: React.PropTypes.array,
  user: React.PropTypes.object,
  currentUser: React.PropTypes.object
}
