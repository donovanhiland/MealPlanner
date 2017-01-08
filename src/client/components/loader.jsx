class Loader extends React.Component {

  render() {
    return (
      <div className="w-100" style={{'textAlign': 'center'}}>
        <span className="loading-spinner m-auto">
          <div className="dots">
            <i className="one"></i>
            <i className="two"></i>
            <i className="three"></i>
          </div>
        </span>
      </div>
    )
  }
}
