import PropTypes from 'prop-types';
import LinkButton from '../LinkButton';
import { utils } from '@qubejs/web-react';
const { DateTime } = utils.datetime;

const DateNavigator = ({
  minDate,
  maxDate,
  className = '',
  value = '',
  onChange,
  errorMessage,
  type = 'month',
  format = 'YYYY-MM-DD',
  span = 1,
  onAnalytics,
  analytics = {},
}: any) => {
  const { next, prev } = analytics;
  const formatDate = (date) => {
    return date.toString(format);
  };
  const handleNext = () => {
    const newvalue = formatDate(
      new DateTime(value).startOf('month').addMonths(span)
    );
    const from = formatDate(
      new DateTime(value).startOf('month').addMonths(span)
    );
    const to = formatDate(
      new DateTime(from).addMonths(span).addDays(-1).endOf('month')
    );
    onChange &&
      onChange({
        value: newvalue,
        from,
        to,
      });
  };
  const handlPrev = () => {
    const newvalue = formatDate(
      new DateTime(value).startOf('month').addMonths(span * -1)
    );
    const from = formatDate(
      new DateTime(value).startOf('month').addMonths(span * -1)
    );
    const to = formatDate(
      new DateTime(from)
        .addMonths(span * -1)
        .endOf('month')
        .addDays(-1)
    );
    onChange &&
      onChange({
        value: newvalue,
        from,
        to,
      });
  };

  const labelDisplay =
    type === 'range'
      ? `${new DateTime(value)
          .startOf('month')
          .toString('month')} - ${new DateTime(value)
          .startOf('month')
          .addMonths(span)
          .addDays(-1)
          .toString('month')}`
      : new DateTime(value).toString('month');
  const minDateDisabled = minDate
    ? new DateTime(minDate).date() >=
      new DateTime(value).startOf('month').date()
    : false;
  const maxDateDisabled = maxDate
    ? new DateTime(maxDate).date() <=
      new DateTime(value).startOf('month').addMonths(span).addDays(-1).date()
    : false;
  return (
    <div className={`sq-date-navigator ${className}`}>
      <div className="sq-date-navigator__container">
        <div className="sq-date-navigator__nav-left">
          <LinkButton
            analytics={prev}
            onAnalytics={onAnalytics}
            disabled={minDateDisabled}
            iconName="arrow-left"
            size="large"
            onClick={handlPrev}
          />
        </div>
        <div className="sq-date-navigator__content">{labelDisplay}</div>
        <div className="sq-date-navigator__nav-right">
          <LinkButton
            analytics={next}
            onAnalytics={onAnalytics}
            disabled={maxDateDisabled}
            iconName="arrow-right"
            size="large"
            onClick={handleNext}
          />
        </div>
      </div>
      {errorMessage && (
        <div className="sq-error sq-date-navigator--error">{errorMessage}</div>
      )}
    </div>
  );
};

DateNavigator.propTypes = {
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  maxDate: PropTypes.any,
  minDate: PropTypes.any,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default DateNavigator;
