class BrixioModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {}

  render() {
    var iconName;

    switch (this.props.category) {
      case "warning":
        iconName = "warning"
        break;
      default:
        iconName = "info_outline"
        break;
    }

    return (
      <ReactModalDialog.ModalContainer onClose={this.props.onClose}>
        <ReactModalDialog.ModalDialog>
          <div className={`brixio-modal-component ${this.props.category || ''} ${this.props.size || ''}`}>
            <i onClick={this.props.onClose} className="material-icons brixio-modal-close">clear</i>
            <div className="brixio-modal-header">
              <i className="material-icons brixio-modal-header-icon">{iconName}</i>
              {this.props.title}
            </div>
            {this.props.subtitle && <div className="brixio-modal-subHeader">
              <div className="brixio-modal-sub-title">{this.props.subtitle}</div>
              {this.props.subtitleDescription && <div className="brixio-modal-sub-title-description">{this.props.subtitleDescription}</div>}
            </div>}
            <div className="brixio-modal-body">
              {this.props.children}
            </div>
            <div className="brixio-modal-footer">
              <div className="pull-left">{this.props.footerLeft}</div>
              <div className="pull-right">{this.props.buttons}</div>
              <div className="clear"/>
            </div>
          </div>
        </ReactModalDialog.ModalDialog>
      </ReactModalDialog.ModalContainer>
    )
  }
}
