class EditContact extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    let errors = this.personEditForm.validateAll();
    let isValid = _.isEmpty(errors);
    this.props.handleValueChange(event, isValid);
  }

  onSubmit(event) {
    event.preventDefault();

    let errors = this.personEditForm.validateAll();
    let isValid = _.isEmpty(errors);
    if (isValid) {
      this.props.onSubmit(event);
    }
  }

  render() {

    let person = this.props.person;

    return (
      <Validation.components.Form className="edit-contact-component" ref={(form) => {
        this.personEditForm = form;
      }} onSubmit={this.onSubmit}>
        <div className="row m-x-0">
          <div className="col-md-6 p-left-0 form-row">
            <BrixioTextField type="text" value={person.first_name} onChange={this.onChange} name='first_name' placeholder="First Name" validations={['required']}/>
          </div>
          <div className="col-md-6 p-right-0 form-row">
            <BrixioTextField type="text" value={person.last_name} onChange={this.onChange} name='last_name' placeholder="Last Name" validations={['required']}/>
          </div>
        </div>
        <div className="row m-x-0">
          <div className="col-md-6 p-left-0 form-row">
            <BrixioTextField type="email" value={person.email} onChange={this.onChange} name='email' placeholder="Email" validations={['required', 'email']}/>
          </div>
          <div className="col-md-6 p-right-0 form-row">
            <BrixioTextField type="text" value={person.cell_phone} onChange={this.onChange} name='cell_phone' placeholder="Phone #" validations={['required']}/>
          </div>
        </div>
        {/* This hidden button is so the form will submit when pressing enter/return */}
        <button type="submit" className="hidden"/>
      </Validation.components.Form>

    )
  }
}

EditContact.propTypes = {
  deal: React.PropTypes.object
};
