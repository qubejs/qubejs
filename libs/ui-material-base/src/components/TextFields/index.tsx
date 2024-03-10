import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import Link from '../Link';
import LinkButton from '../LinkButton';
import Text from '../Text';
const { formatters } = utils.format;
const { getValue } = utils.properties;
const common = utils.common;

const compMap = {
  Text,
  Link,
  LinkButton
};

const TextFields = ({ className = '', fields = [], row }: any) => {
  return (
    <div className={`sq-text-fields ${className}`}>
      {fields.map((itemField, index) => {
        const isRender = itemField.beforeRender ? itemField.beforeRender(itemField, row, row) : true;
        if (typeof(isRender) === 'object') {
          itemField = {
            ...itemField,
            ...isRender
          }
        }
        const { type: cmpType, defaultValue = '', formatter = {}, component, render, ...field } = itemField;
        const { type, ...restFormatter } = formatter;
        const textValue = getValue(this, defaultValue, row);
        const valueRender = render && render(row, field);
        const CompRender = compMap[cmpType] || compMap.Text;
        const newValue =
          (type && formatters[type] && formatters[type](row[field.name], { defaultValue: textValue, field, row, ...restFormatter }, row)) ||
          row[field.name] || valueRender ||
          textValue;
        const classValue = getValue(this, field.className, row);
        return !common.isNullOrUndefined(newValue) && isRender !== false ? (
          <CompRender key={index} className={`${classValue}`} {...field} {...component} value={newValue} />
        ) : undefined;
      })}
    </div>
  );
};
TextFields.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  fields: PropTypes.array,
  row: PropTypes.object,
  tag: PropTypes.string
};

export default TextFields;
