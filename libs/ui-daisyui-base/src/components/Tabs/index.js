import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import { Tabs, TabsList, TabsTrigger } from '../../daisy/ui/tabs';
import { utils } from '@qubejs/web-react';
import Icon from '../Icon';
const { getValue } = utils.properties;
const { Validator } = utils.validator;


class SQTabs extends React.Component {
  constructor() {
    super();
    this.state = {
      value: undefined
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      value: this.props.value
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value
      });
    }
  }
  handleChange(key) {
    const { valueField = 'value', options = [], row } = this.props;
    const finalOptions = getValue(this, options, row) || [];
    // Radix Tabs values are strings; map back to the option's original value
    const match = finalOptions.find((o) => `${o[valueField]}` === key);
    this.select(match ? match[valueField] : key);
  }

  select(newValue) {
    const { onChange, valueField = 'value', options = [], row } = this.props;
    const finalOptions = getValue(this, options, row);
    const item = filter(finalOptions, { [valueField]: newValue });
    onChange &&
      onChange({
        value: newValue,
        data: item[0]
      });
    this.setState({
      value: newValue,
      data: item[0]
    });
  }

  render() {
    const { options = [], className = '', indicatorColor = 'primary', textField = 'text', valueField = 'value', iconOnly = false, row, userData } = this.props;
    const finalOptions = getValue(this, options, row);
    return (
      <div className={`sq-tabs ${className}`}>
        <Tabs
          value={`${this.state.value ?? (finalOptions[0] && finalOptions[0][valueField])}`}
          onValueChange={this.handleChange}
          className={'sq-tabs__root'}
        >
          <TabsList variant={indicatorColor === 'secondary' ? 'line' : 'default'} className="sq-tabs__list">
          {finalOptions && finalOptions.map((tab, idx) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [textField]: text, [valueField]: value, className, iconName, icon: iconConfig = {}, disabled, match, ...rest } = tab;
            const { ...icon } = iconConfig;
            let finalDisabled = disabled;
            if (typeof (disabled) === 'object' && disabled.match) {
              const validator = new Validator(disabled.match);
              validator.setValues({ ...userData, ...tab });
              finalDisabled = validator.validateAll();
            }
            let isRender = true;
            if (typeof (match) === 'object' && match) {
              const validator = new Validator(match);
              validator.setValues({ ...userData, ...tab });
              isRender = validator.validateAll();
            }
            const IconToRender = iconName && <Icon name={iconName} variant="normal" {...icon} />;
            if (isRender) {
              return (
                <TabsTrigger
                  key={'tab' + idx}
                  value={`${value}`}
                  aria-label={text}
                  className={`sq-tabs__tab ${className || ''}`}
                  disabled={!!finalDisabled}
                >
                  {IconToRender}
                  {!iconOnly && text}
                </TabsTrigger>
              );
            }
            return null;
          })}
          </TabsList>
        </Tabs>
      </div>
    );
  }
}

SQTabs.propTypes = {
  className: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  onChange: PropTypes.func,
  value: PropTypes.string
};

export default SQTabs;
