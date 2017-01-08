import React from 'react';

class DealAssignment extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if (!$(e.target).hasClass('deal-row-notes-icon')) {
      let link = "/deals/" + this.props.id;
      window.open(link, '_blank');
    }
  }

  render() {
    var statusClass = "table-dot " + this.props.status;
    var notesUrl = "/deals/" + this.props.id + "/modal_notes";

    return (
      <tr className='clickable-row' onClick={this.handleClick}>
        <td>{this.props.organization}</td>
        <td>{this.props.agent}</td>
        <td className="status">
          <span className={statusClass}></span>{this.props.status}
        </td>
        <td>{this.props.stage}</td>
        <td>{this.props.notesCount}</td>
        <td>{moment(this.props.createdAtRaw).fromNow()}
          <span className="assigned-at-date">{this.props.createdAt}</span>
        </td>
        <td>{this.props.lastViewed}</td>
      </tr>
    );
  }
}

DealAssignment.propTypes = {
  createdAt: React.PropTypes.string,
  stage: React.PropTypes.string,
  status: React.PropTypes.string
};

export default DealAssignment;
