class EditDealRequirements extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    let errors = this.editForm.validateAll();
    let isValid = _.isEmpty(errors);
    this.props.handleValueChange(event, isValid);
  }

  onSubmit(event) {
    event.preventDefault();

    let errors = this.editForm.validateAll();
    let isValid = _.isEmpty(errors);
    if (isValid) {
      this.props.onSubmit(event);
    }
  }

  render() {
    let self = this;
    let requirements = this.props.requirements;

    let count = 0;
    var reqNodes = requirements.map(function(req) {
      count += 1;

      switch (req.input_type) {
        case 'text':
          let validations = ['required'];
          req.data_type === 'number'
            ? validations[1] = 'number'
            : null;
          return <BrixioTextField key={count} type="text" value={req.database_value} onChange={self.onChange} name={req.database_name} placeholder={req.display_name} validations={validations}/>
          break;
        case 'textarea':
          return <BrixioTextarea key={count} value={req.database_value} onChange={self.onChange} name={req.database_name} placeholder={req.display_name} validations={['required']}/>
          break;
        case 'select':
          if (req.select_options.length < 1) {
            return false;
          }
          let optionCount = 0;
          var optionNodes = req.select_options.map(function(option) {
            optionCount += 1;
            return <option key={optionCount} value={option.value}>{option.display_name}</option>
          });
          return (
            <BrixioSelect key={count} value={req.database_value} onChange={self.onChange} name={req.database_name} placeholder={req.display_name} validations={['required']}>
              {optionNodes}
            </BrixioSelect>
          );
          break;
        default:
          console.error('Unknown form input type ' + req.input_type);
          // return ''
          break;
      }

    });

    return (
      <Validation.components.Form className="edit-deal-requirements-component" ref={(form) => {
        this.editForm = form;
      }} onSubmit={this.onSubmit}>
        {/* <div className="row m-x-0">
          <div className="col-md-6 p-left-0 form-row">

          </div>
          <div className="col-md-6 p-right-0 form-row"></div>
        </div> */}
        {reqNodes}
        {/* This hidden button is so the form will submit when pressing enter/return */}
        <button type="submit" className="hidden"/>
      </Validation.components.Form>

    )
  }
}

EditDealRequirements.propTypes = {
  requirements: React.PropTypes.array
};
