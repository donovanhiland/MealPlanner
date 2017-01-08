class BrixioSelect extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.elementId = `${this.props.name}-${Date.now()}`;

    this.state = {
      selectValue: this.props.value,
      isFocused: false
    };
  }

  onChange(event) {
    this.setState({selectValue: event.target.value});
    this.props.onChange(event);
  }

  onFocus(event) {
    this.setState({isFocused: true});
  }

  onBlur(event) {
    this.setState({isFocused: false});
  }

  render() {
    let props = this.props;
    return (
      <div className={`input-wrapper select float-label ${this.state.isFocused
        ? 'focused'
        : ''}`}>
        <label htmlFor={this.elementId}>{props.placeholder}</label>
        <Validation.components.Select type="select" id={this.elementId} errorClassName="error" onFocus={this.onFocus} onBlur={this.onBlur} value={this.state.selectValue} onChange={this.onChange} name={props.name} validations={props.validations}>
          <option value='' disabled>{props.placeholder}</option>
          {props.children}
        </Validation.components.Select>
        <div className="arrow-down"></div>
      </div>
    )
  }
}
