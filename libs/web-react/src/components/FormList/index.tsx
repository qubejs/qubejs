import { useCallback } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Form from '../Form';
import IconButton from '../IconButton';
import { Orderable } from './Orderable';

const FormList = ({
  className = '',
  label,
  fields = [],
  value = [],
  formClassName,
  onChange,
}: any) => {
  const moveCard = (dragIndex, hoverIndex) => {
    onChange &&
      onChange({
        value: update(value, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, value[dragIndex]],
          ],
        }),
      });
  };
  const addNew = () => {
    onChange &&
      onChange({
        value: [...value, {}],
      });
  };
  const valueOnChange = (data, idx) => {
    const itemArr = [...value];
    itemArr[idx] = { ...data.value };
    onChange &&
      onChange({
        value: [...itemArr],
      });
  };

  const removeItem = (idx) => {
    const itemArr = [...value];
    itemArr.splice(idx, 1);
    onChange &&
      onChange({
        value: [...itemArr],
      });
  };
  const renderCard = useCallback(
    (itemVal, idx) => {
      return (
        <div className="sq-form-list__item" key={itemVal.value}>
          <Orderable
            key={itemVal.value}
            index={idx}
            id={itemVal.value}
            moveCard={moveCard}
          >
            <div className="sq-form-list__item-wrap">
              <Form
                className={`pb-0 ${formClassName}`}
                fields={fields}
                value={itemVal}
                onChange={(data) => valueOnChange(data, idx)}
              />
              <IconButton
                iconName="Delete"
                color="error"
                size="small"
                onClick={() => removeItem(idx)}
              />
            </div>
          </Orderable>
        </div>
      );
    },
    [value]
  );
  return (
    <div className={`sq-form-list ${className}`}>
      <div className="sq-form-list__label mb-wide">{label}</div>
      {value && value.map((itemVal, idx) => {
        return renderCard(itemVal, idx);
      })}
      <IconButton iconName="add" onClick={addNew} />
    </div>
  );
};

FormList.propTypes = {
  fields: PropTypes.array,
  value: PropTypes.array,
};

export default FormList;
