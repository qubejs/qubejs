import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import Link from '../Link';
import Dialog from '../Dialog';
import { getValue } from '../../utils/properties';
import ItemList from './ItemList';

class SelectPopup extends React.Component {
  props: any;
  static propTypes: any;
  state: any;
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };
    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  handleOnClick(e) {
    e.preventDefault();
    this.setState({
      openDialog: true,
    });
  }
  handleOnClose() {
    this.setState({
      openDialog: false,
    });
  }
  checkCurrentValue() {
    const { options, valueField, value, row } = this.props;
    const finalOptions = getValue(this, options, row);
    const foundOptions = filter(finalOptions, { [valueField]: value });
    const isValid = foundOptions.length > 0;
    if (isValid) {
      this.setState({
        currentItem: foundOptions[0],
      });
    } else {
      this.setState({
        currentItem: null,
      });
    }
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.options !== prevProps.options || this.props.value !== prevProps.value) {
      this.checkCurrentValue();
    }
  }
  handleOnSelect(value, dataItem) {
    const { onChange } = this.props;
    this.setState({
      currentItem: dataItem,
      value: value,
      openDialog: false,
    });
    onChange &&
      onChange({
        value,
        data: dataItem,
      });
  }

  render() {
    const { className = '', actionLabel = 'Select', actionChangeLabel = 'Change', labelSearch = 'Search', textFormatter, label, options, row, value, iconField, iconType, iconProps, textField = 'text', valueField = 'value', itemTemplate, error, errorMessage }: any = this.props;
    const finalOptions = getValue(this, options, row);
    const foundOptions = filter(finalOptions, { [valueField]: value });
    const finalOption = this.state.currentItem ? this.state.currentItem : foundOptions.length > 0 ? foundOptions[0] : null;
    const finalText = (finalOption && (textFormatter ? textFormatter(finalOption) : finalOption[textField])) || label;
    return (
      <div className={`sq-select-popup ${className} ${error ? 'sq-select-popup--error' : ''}`}>
        {finalOption && <div className="sq-select-popup__eyebrow">{label}</div>}
        <div className="sq-select-popup__container" onClick={this.handleOnClick}>
          <div className={`sq-select-popup__selected-text ${!finalOption ? 'default' : 'selected'}`}>{finalText}</div>
          <Link size="small" onClick={this.handleOnClick}>
            {!finalOption ? actionLabel : actionChangeLabel}
          </Link>
        </div>
        {errorMessage && <div className="sq-error sq-select-field--error">{errorMessage}</div>}
        <Dialog open={this.state.openDialog} fullScreen={true} onClose={this.handleOnClose} title={actionLabel} content={<ItemList onSelect={this.handleOnSelect} textField={textField} labelSearch={labelSearch} itemTemplate={itemTemplate} valueField={valueField} iconField={iconField} iconProps={iconProps} iconType={iconType} data={finalOptions} />} />
      </div>
    );
  }
}

SelectPopup.propTypes = {
  name: PropTypes.string,
  defaultText: PropTypes.string,
  errorMessage: PropTypes.string,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  row: PropTypes.object,
  className: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  value: PropTypes.string,
  textField: PropTypes.string,
  valueField: PropTypes.string,
  onChange: PropTypes.func,
};

export default SelectPopup;
