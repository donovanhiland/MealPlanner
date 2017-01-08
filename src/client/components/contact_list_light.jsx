class ContactListLight extends React.Component {

  constructor(props) {
    super(props);

    this.showContactEditModal = this.showContactEditModal.bind(this);
    this.handlePersonValueChange = this.handlePersonValueChange.bind(this);
    this.onSubmitPersonEditForm = this.onSubmitPersonEditForm.bind(this);
    this.isPersonFormDifferent = this.isPersonFormDifferent.bind(this);

    var editedPerson = JSON.parse(JSON.stringify(props.deal.person));

    this.state = {
      showContactEditModal: false,
      editedPerson: editedPerson,
      editPersonSubmitButtonEnabled: false,
      isSavingEditPerson: false
    };

  }

  handlePersonValueChange(event, isValid) {
    var editedPerson = this.state.editedPerson;
    editedPerson[event.target.name] = event.target.value;

    let isDifferent = this.isPersonFormDifferent(editedPerson, this.props.deal.person);
    let canSubmit = (isDifferent && isValid) || false;
    this.setState({editedPerson: editedPerson, editPersonSubmitButtonEnabled: canSubmit});
  }

  isPersonFormDifferent(editedPerson, originalPerson) {
    return !_.isEqual(editedPerson, originalPerson);
  }

  showContactEditModal(shouldShow) {
    // Reset the editedPerson, mainly for when you close the modal with a cancel or x
    let editedPerson = JSON.parse(JSON.stringify(this.props.deal.person));
    this.setState({showContactEditModal: shouldShow, editedPerson: editedPerson, editPersonSubmitButtonEnabled: false});
  }

  onSubmitPersonEditForm(event) {
    event.preventDefault();

    var self = this;

    let isDifferent = this.isPersonFormDifferent(this.state.editedPerson, this.props.deal.person);
    if (!isDifferent) {
      return false;
    }

    this.setState({isSavingEditPerson: true, editPersonSubmitButtonEnabled: false});

    let objectForRequest = {
      id: this.state.editedPerson.id,
      deal_id: this.props.deal.id,
      person: this.state.editedPerson
    }
    updateResource(objectForRequest, "people", "person").then(result => {
      this.setState({isSavingEditPerson: false, editPersonSubmitButtonEnabled: false, showContactEditModal: false});
      console.log(result)
    }, error => {
      this.setState({isSavingEditPerson: false, editPersonSubmitButtonEnabled: false});
      console.error(error.toString());
    });
  }

  render() {
    var contactNodes = this.props.contacts.map(function(contact) {
      return (
        <div key={contact.id} className="contact-component">
          <div className="card-content">
            <div className="contact-avatar">
              <Avatar user={contact}></Avatar>
            </div>
            <div className="contact-details details">
              <div className="contact-details-left">
                <div className="name font-large">{contact.name}</div>
                {/*<div className="company font-normal">{contact.company
                    ? contact.company
                    : "Company Name Here"}</div>*/}
              </div>
              <div className="contact-details-right">
                <div className="contact-method">email: {contact.email
                    ? <a className="link" href={"mailto:" + contact.email} target="_top">{contact.email}</a>
                    : "Unknown"}</div>
                <div className="contact-method">phone: {contact.cell_phone_normalized
                    ? <span>{contact.cell_phone_formatted}</span>
                    : "Unknown"}</div>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      )
    });

    let buttons = (
      <div className="buttons-section">
        <button className={`button pull-right strong ${this.state.editPersonSubmitButtonEnabled
          ? ''
          : 'disabled'}`} disabled={!this.state.editPersonSubmitButtonEnabled} onClick={this.onSubmitPersonEditForm}>Submit</button>
        <button className="button secondary pull-right" onClick={() => this.showContactEditModal(false)}>Cancel</button>
      </div>
    );

    let loader = (
      <div className={`edit-contact-loader ${this.state.isSavingEditPerson
        ? ''
        : 'hidden'}`}>
        <Loader/>
      </div>
    );

    return (
      <div className="card contact-list-light-component">
        {this.state.showContactEditModal && <BrixioModal title="Edit Contact Details" onClose={() => this.showContactEditModal(false)} buttons={buttons} footerLeft={loader}>
          <EditContact person={this.state.editedPerson} handleValueChange={this.handlePersonValueChange} isSaving={this.state.isSavingEditPerson} onSubmit={this.onSubmitPersonEditForm}/>
        </BrixioModal>}
        <div className="card-header">Contact
          <div className="card-header-button">
            <i className="material-icons" onClick={() => this.showContactEditModal(true)}>mode_edit</i>
          </div>
        </div>
        {contactNodes}
      </div>
    )
  }
}
ContactListLight.propTypes = {
  contacts: React.PropTypes.array
}
