
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

const PropsTable = ({ props = [], className = '' }: any) => {
  return (
    <div className={`props-table ${className}`}>
      <div className="props-table__header">
        <div className="props-table__header-row">
          <div className="props-table__header-cell">Name</div>
          <div className="props-table__header-cell">Type</div>
          <div className="props-table__header-cell">Default</div>
          <div className="props-table__header-cell">Description</div>
        </div>
      </div>
      <div className="props-table__body">
        {props.map((prop) => {
          return (
            <div className="props-table__body-row">
              <div className="props-table__body-cell name">{ReactHtmlParser(prop.name)}</div>
              <div className="props-table__body-cell type">{ReactHtmlParser(prop.type)}</div>
              <div className="props-table__body-cell default-value">{ReactHtmlParser(prop.defaultValue)}</div>
              <div className="props-table__body-cell description">{ReactHtmlParser(prop.description)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

PropsTable.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string
};

export default PropsTable;
