class Breadcrumbs extends React.Component {
  render() {
    var length = this.props.breadcrumbs.length
    var crumbs = this.props.breadcrumbs.map(function(crumb, i) {
      if (i === length - 1) {
        return (
          <span key={i}>{crumb.name}</span>
        )
      } else {
        return (
          <span key={i}>
            <a href={crumb.path}>{crumb.name}</a>
            <i className="material-icons breadcrumb-separator">
              keyboard_arrow_right
            </i>
          </span>
        )
      }
    });
    return (
      <div>{crumbs}</div>
    );
  }
}

Breadcrumbs.propTypes = {
  breadcrumbs: React.PropTypes.array
}
