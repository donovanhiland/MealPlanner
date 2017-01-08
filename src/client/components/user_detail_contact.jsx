class UserDetailContact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }

  render() {
    var user = this.state.user;
    return (
      <div className="card">
        <div className="card-header">Contact Info</div>

        <div key={user.id} className="contact-component">
          <div className="card-content">
            <div className="contact-avatar">
              <Avatar user={user}></Avatar>
            </div>
            <div className="contact-details details">
              <div className="contact-details-left">
                <div className="name font-large">{user.first_name} {user.last_name}</div>
              </div>
              <div className="contact-details-right">
                <div className="contact-method">email: {user.email
                    ? <a className="link" href={"mailto:" + user.email} target="_top">{user.email}</a>
                    : "Unknown"}</div>
                <div className="contact-method">phone: {user.cell_phone_normalized
                    ? <span className="link">{user.cell_phone_formatted}</span>
                    : "Unknown"}</div>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    )
  }
}

UserDetailContact.propTypes = {
  user: React.PropTypes.object
};
