import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import filter from 'lodash/filter';
import Link from '../Link';
import Dialog from '../Dialog';
import { utils } from '@qubejs/web-react';
import ItemList from './ItemList';

const { getValue } = utils.properties;

const SelectPopup = ({
  name,
  className = '',
  actionLabel = 'Select',
  onChange,
  actionChangeLabel = 'Change',
  labelSearch = 'Search',
  textFormatter,
  label,
  multiple = false,
  options,
  limitItems = 3,
  row,
  value,
  iconField,
  iconType,
  iconProps,
  textField = 'text',
  valueField = 'value',
  itemTemplate,
  error,
  errorMessage,
}: any) => {
  const [iValue, setIValue] = useState<any>();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [finalOptions, setFinalOptions] = useState(null);

  const handleOnSelect = (value, dataItem) => {
    if (multiple) {
      let arraNew;
      if (currentItem?.indexOf(dataItem) > -1) {
        arraNew = [...currentItem];
        arraNew.splice(currentItem.indexOf(dataItem), 1);
      } else {
        arraNew = [...(currentItem || []), dataItem];
      }
      const values = arraNew.map((i) => i[valueField]);
      setCurrentItem(arraNew);
      setIValue(values);
      onChange &&
        onChange({
          value: values,
          data: arraNew,
        });
    } else {
      const currentVal = currentItem === dataItem ? null : value;
      const finCurrentItem = currentItem === dataItem ? null : dataItem;
      setCurrentItem(finCurrentItem);
      setOpenDialog(false);
      setIValue(currentVal);
      onChange &&
        onChange({
          value: currentVal,
          data: finCurrentItem,
        });
    }
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };
  const handleOnClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (multiple) {
      if (value && !Array.isArray(value)) {
        setIValue([value]);
      } else {
        setIValue(value);
      }
    }
    checkCurrentValue();
  }, [value, options]);

  const checkCurrentValue = () => {
    const finalOptions = getValue(this, options, row);
    if (!multiple) {
      const foundOptions = filter(finalOptions, { [valueField]: value });
      const isValid = foundOptions.length > 0;
      if (isValid) {
        setCurrentItem(foundOptions[0]);
      } else {
        setCurrentItem(null);
      }
    } else {
      const foundOptions = filter(finalOptions, (item) => {
        return value?.indexOf(item[valueField]) > -1;
      });
      const isValid = foundOptions.length > 0;
      if (isValid) {
        setCurrentItem(foundOptions);
      } else {
        setCurrentItem(null);
      }
    }
    setFinalOptions(finalOptions);
  };

  // const : any = this.props;
  // const finalOptions = getValue(this, options, row);
  // const foundOptions = filter(finalOptions, { [valueField]: value });
  // const finalOption = currentItem
  //   ? currentItem
  //   : foundOptions.length > 0
  //   ? foundOptions[0]
  //   : null;
  let finalText = '';
  let tooltipTest;
  if (!multiple) {
    finalText =
      (currentItem &&
        (textFormatter
          ? textFormatter(currentItem)
          : currentItem[textField])) ||
      label;
    tooltipTest = finalText;
  } else {
    let count = 0;
    while (count < limitItems && count < currentItem?.length) {
      finalText += (finalText && ', ') + 
        (currentItem &&
          currentItem.length > 0 &&
          (textFormatter
            ? textFormatter(currentItem[count])
            : currentItem[count][textField])) ||
        '';
      count++;
    }
    finalText = finalText || label;
    tooltipTest = currentItem?.map((item) => item[textField]).join(', ');
  }
  const totalItems = multiple ? currentItem?.length : null;
  return (
    <div
      className={`sq-select-popup ${className} ${
        error ? 'sq-select-popup--error' : ''
      }`}
    >
      {currentItem && <div className="sq-select-popup__eyebrow">{label}</div>}
      <div className="sq-select-popup__container" onClick={handleOnClick}>
        <div
          className={`sq-select-popup__selected-text ${
            !currentItem ? 'default' : 'selected'
          }`}
        >
          <Tooltip title={tooltipTest}>
            <div className="sq-select-popup__selected-text-main">
              {finalText}
            </div>
          </Tooltip>
          <div className="sq-select-popup__selected-text-more">
            {totalItems > limitItems ? ` +${totalItems - limitItems}` : ''}
          </div>
        </div>
        <Link size="small" onClick={handleOnClick}>
          {!currentItem ? actionLabel : actionChangeLabel}
        </Link>
      </div>
      {errorMessage && (
        <div className="sq-error sq-select-field--error">{errorMessage}</div>
      )}
      <Dialog
        open={openDialog}
        fullScreen={true}
        onClose={handleOnClose}
        title={actionLabel}
        content={
          <ItemList
            onSelect={handleOnSelect}
            textField={textField}
            value={iValue || value}
            multiple={multiple}
            labelSearch={labelSearch}
            itemTemplate={itemTemplate}
            valueField={valueField}
            iconField={iconField}
            iconProps={iconProps}
            iconType={iconType}
            data={finalOptions}
          />
        }
      />
    </div>
  );
};

SelectPopup.propTypes = {
  name: PropTypes.string,
  defaultText: PropTypes.string,
  errorMessage: PropTypes.string,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  row: PropTypes.object,
  className: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  textField: PropTypes.string,
  valueField: PropTypes.string,
  onChange: PropTypes.func,
};

export default SelectPopup;
