class NewPhoneCall extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div></div>
    )
  }
}

NewPhoneCall.propTypes = {
  tabName: React.PropTypes.string,
  tabIcon: React.PropTypes.string
};

NewPhoneCall.defaultProps = {
  tabName: 'New Call',
  tabIcon: 'phone'
}
