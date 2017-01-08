class Avatar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      initials: ((props.user.first_name
        ? props.user.first_name.charAt(0)
        : '') + (props.user.last_name
        ? props.user.last_name.charAt(0)
        : ''))
    };
  }

  render() {
    return (
      <div className={'avatar' + (this.props.user.avatar
        ? 'has-avatar'
        : ' ') + (this.props.size)}>
        <div className="initials">
          {this.state.initials}
        </div>
      </div>
    )
  }
}

Avatar.propTypes = {
  user: React.PropTypes.object,
  size: React.PropTypes.string
};

Avatar.defaultProps = {
  user: {},
  size: "large"
}
