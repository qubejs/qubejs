import { storage, format, redirect } from '../../../utils';
const DefaulSearch = ({
  iconName,
  header,
  description,
  date,
  link,
  dateFormat,
}) => {
  const { Icon, LinkButton } = storage.components.get();
  const { to, urlParams } = link || {};
  const options = {};
  if (dateFormat) {
    options.format = dateFormat;
  }
  const { dateFullTime } = format.getFormatters();
  const handleClick = () => {
    if (to) {
      redirect.redirectTo(to, urlParams);
    }
  };
  return (
    <div
      className={`sq-search-result-template default ${to ? 'has-link' : ''}`}
      onClick={handleClick}
    >
      <div className="top-header">
        {iconName && <Icon size="large" name={iconName} />}
        <h2 className="title">{header}</h2>
      </div>
      <div className="description">{description}</div>
      {date && <div className="date-field">{dateFullTime(date, options)}</div>}
      {to && (
        <LinkButton
          to={to}
          urlParams={urlParams}
          target="_blank"
          className="open-link"
          iconName="ArrowOutward"
        />
      )}
    </div>
  );
};

export default DefaulSearch;
