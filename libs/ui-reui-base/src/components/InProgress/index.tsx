import PropTypes from 'prop-types';

const InProgress = ({ text = 'Please wait...' }: any) => {
  return (
    <div className="in-proccess" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', position: 'fixed', height: '100%', width: '100%', zIndex: '999999999' }}>
      <div className="in-progress-text" style={{ color: '#233f45' }}>
        {text}
      </div>
    </div>
  );
};
InProgress.propTypes = {
  text: PropTypes.string,
};
export default InProgress;
