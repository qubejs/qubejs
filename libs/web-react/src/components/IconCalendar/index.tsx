import PropTypes from 'prop-types';
import moment from 'moment-timezone';


const IconCalendar = ({ className = '', value, yearFormat = 'YY', color = 'default', size = 'normal', row, onClick }:any) => {
  const day = moment(value).format('DD');
  const month = moment(value).format('MMM');
  const year = moment(value).format(yearFormat);
  return (
    <div
      className={`sq-icon-calendar sq-icon-calendar--${typeof color === 'function' ? color(row) : color} sq-icon-calendar--${size} ${className}`}
      onClick={onClick}
    >
      <div className="sq-icon-calendar__day">{day}</div>
      <div className="sq-icon-calendar__month">
        {month}
        {"'"}
        {year}
      </div>
    </div>
  );
};

IconCalendar.propTypes = {
  name: PropTypes.any,
  svg: PropTypes.node,
  className: PropTypes.string,
  row: PropTypes.object,
  textIcon: PropTypes.any,
  onClick: PropTypes.func,
  variant: PropTypes.any,
  value: PropTypes.any,
  classes: PropTypes.object,
  size: PropTypes.string
};

export default IconCalendar;
