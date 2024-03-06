import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';

const LabelDisplay = ({ label, value, className = '' }: any) => {
  return (
    <div className={`sq-launch-timer__label-ct ${className}`}>
      <div className="sq-launch-timer__value">{value >= 0 ? value : '00'}</div>
      <div className="sq-launch-timer__label">
        {label}
        {value > 0 ? 's' : ''}
      </div>
    </div>
  );
};

const LaunchTimer = ({
  eyebrow,
  header = '',
  subHeader = '',
  value = '',
  className = '',
}: any) => {

  const [innerValue, setInnervalue] = useState();
  const [intervalId, setInterValId] = useState(null);
  useEffect(() => {
    if (!intervalId) {
      setInnervalue(new utils.datetime.DateTime().toString());
      const id = setInterval(() => {
        setInnervalue(new utils.datetime.DateTime().toString());
      }, 1000);
      setInterValId(id);
    }
  });
  const days = utils.number.preFix(
    new utils.datetime.DateTime(value).diffInDays(
      new utils.datetime.DateTime(innerValue)
    )
  );
  const hours = utils.number.preFix(
    new utils.datetime.DateTime(value).diffInHours(
      new utils.datetime.DateTime(innerValue)
    ) -
      days * 24
  );
  const minutes = utils.number.preFix(
    new utils.datetime.DateTime(value).diffInMinutes(
      new utils.datetime.DateTime()
    ) -
      (days * 24 * 60 + hours * 60)
  );
  const seconds = utils.number.preFix(
    new utils.datetime.DateTime(value).diffInSeconds(
      new utils.datetime.DateTime()
    ) -
      (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60)
  );

  return (
    <div className={`sq-launch-timer ${className}`}>
      <div className="sq-launch-timer__digits">
        <LabelDisplay
          label="Day"
          className="sq-launch-timer__days"
          value={days}
        />
        <LabelDisplay
          label="Hour"
          className="sq-launch-timer__hours"
          value={hours}
        />
        <LabelDisplay
          label="Minute"
          className="sq-launch-timer__minutes"
          value={minutes}
        />
        <LabelDisplay
          label="Second"
          className="sq-launch-timer__seconds"
          value={seconds}
        />
      </div>
    </div>
  );
};

LaunchTimer.propTypes = {
  header: PropTypes.string,
  subHeader: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
};

export default LaunchTimer;
