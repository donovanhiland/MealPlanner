class ConfirmDialog extends React.Component {

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);

  }

  confirm() {
    this.props.confirmAction();
  }

  cancel() {
    this.props.cancelAction();
  }

  render() {

    let buttons = (
      <div className="buttons-section">
        <button className="button warning pull-right strong" onClick={this.confirm}>{this.props.confirmButtonText}</button>
        <button className="button secondary pull-right" onClick={this.cancel}>Cancel</button>
      </div>
    );

    return (
      <BrixioModal category="warning" size="small" title={this.props.title} onClose={this.cancel} buttons={buttons}>
        <div className="multi-line-font-large">
          {this.props.message}
        </div>
      </BrixioModal>
    )
  }
}

ConfirmDialog.propTypes = {
  message: React.PropTypes.string,
  confirmAction: React.PropTypes.func,
  cancelAction: React.PropTypes.func,
  confirmButtonText: React.PropTypes.string
};

ConfirmDialog.defaultProps = {
  defaultConfirmButtonText: 'Confirm'
}
