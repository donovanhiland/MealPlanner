class BrixioTextarea extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.elementId = `${this.props.name}-${Date.now()}`;

    let shouldFloat = this.props.value
      ? true
      : false;

    this.state = {
      shouldFloat: shouldFloat,
      textValue: this.props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.textValue !== nextProps.value) {
      this.setState({textValue: nextProps.value});
    }
  }

  onChange(event) {
    this.setState({textValue: event.target.value});
    this.props.onChange(event);
  }

  onFocus(event) {
    this.setState({shouldFloat: true});
  }

  onBlur(event) {
    let shouldFloat = this.state.textValue
      ? true
      : false;
    this.setState({shouldFloat: shouldFloat});
  }

  render() {
    let props = this.props;
    return (
      <div className={`input-wrapper textarea ${this.state.shouldFloat
        ? 'float-label'
        : ''}`}>
        <label htmlFor={this.elementId}>{props.placeholder}</label>
        <Validation.components.Textarea onFocus={this.onFocus} onBlur={this.onBlur} type="textarea" id={this.elementId} errorClassName="error" value={this.state.textValue} onChange={this.onChange} name={props.name} validations={props.validations}/>
      </div>
    )
  }
}
