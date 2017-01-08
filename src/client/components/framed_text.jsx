/* global React */
const FramedText = props => (
  <div className='content-frame'>
    <div className='header'>Concierge Comments</div>
    <div className='content normal'>
      <div>{props.text}</div>
    </div>
  </div>
);

FramedText.propTypes = {
  text: React.PropTypes.string,
};
