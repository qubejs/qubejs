import PropTypes from 'prop-types';
import Icon from '../Icon';

const CardButton = ({
  eyebrow = '',
  className = '',
  header = '',
  value,
  selectedValue = '',
  subHeader = '',
  iconName = '',
  color = 'default',
  variant = 'default',
  onChange
}) => {
  const checked = value === true || value === selectedValue;

  const handleClick = (e) => {
    const newChecked = !checked;
    onChange &&
      onChange({
        value: newChecked && (selectedValue || newChecked),
        checked: newChecked
      });
  };
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
      handleClick(e);
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-pressed={checked}
      className={`sq-card-button ${className} ${checked ? 'sq-card-button--checked' : ''}`}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <div className="sq-card-button__container">
        <Icon name={checked ? 'radiochecked' : 'radiouncheck'} />
        <div className="sq-card-button__eyebrow">{eyebrow}</div>
        <div className="sq-card-button__header">{header}</div>
        <div className="sq-card-button__sub-header">{subHeader}</div>
      </div>
    </div>
  );
};

CardButton.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string,
  subHeader: PropTypes.string,
  iconName: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string
};

export default CardButton;
