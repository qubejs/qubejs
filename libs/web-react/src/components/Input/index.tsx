import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@mui/material';
import { getValue, idFromLabel } from '../../utils/properties';
import { getMasks } from '../../utils/mask';
import { getRandomS8 } from '../../utils/number';
import { getValidators } from '../../utils/validator';

class Input extends React.Component {
  props:any;
  input:any;
  state:any;
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = {
      identifier: getRandomS8(),
      value: '',
      valueBeforeKeyUp: '',
      focused: false,
      hasChanged: false,
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
  }

  handleOnChange(evt) {
    const validators = getValidators();
    const { keyup = {} } = this.props;
    const { type, ...rest } = keyup;
    const keyUpValidator = validators[type];
    let value = this.removeMask(evt.target.value);
    if (keyUpValidator && value && keyUpValidator(value, rest) === false) {
      value = this.removeMask(this.state.valueBeforeKeyUp);
    }
    this.setState({
      value: value,
      hasChanged: true,
    });
    this.setState({
      focusCalled: false,
    });
    const { onKeyPress, onAnalytics, analytics = {} } = this.props;
    onKeyPress &&
      onKeyPress({
        value: value,
      });
    const { keypress } = analytics;
    keypress &&
      onAnalytics &&
      onAnalytics({
        ...keypress,
      });
  }

  componentDidMount() {
    this.setState({
      value: this.props.value !== undefined ? this.removeMask(this.props.value) : '',
    });
  }

  applyMask(value = '') {
    const { mask = {}, userData } = this.props;
    const { type, ...rest } = mask;
    return getMasks()[type]
      ? getMasks()[type].mask(value, {
          input: this.state.focused,
          ...rest,
          userData,
        })
      : value;
  }

  removeMask(value = '') {
    const { mask = {}, userData } = this.props;
    const { type, ...rest } = mask;
    return getMasks()[type]
      ? getMasks()[type].unmask(value, {
          input: this.state.focused,
          ...rest,
          userData,
        })
      : value;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.removeMask(this.props.value),
      });
    }
    if (this.props.doFocus && !this.state.focusCalled) {
      setTimeout(() => {
        this.input?.focus();
        this.setState({
          focusCalled: false,
        });
      }, 100);
      this.setState({
        focusCalled: true,
      });
    }
  }

  handleFocus() {
    this.setState({
      focused: true,
    });
    const { onAnalytics, analytics = {} } = this.props;
    const { focus } = analytics;
    focus &&
      onAnalytics &&
      onAnalytics({
        ...focus,
      });
  }

  handleBlur() {
    const { onBlur, onChange, onAnalytics, analytics = {} } = this.props;
    const { change } = analytics;
    this.setState({
      focused: false,
      focusCalled: false,
    });
    if (this.state.value != this.props.value || this.state.value === '') {
      onBlur &&
        onBlur({
          value: this.state.value,
        });
      onChange &&
        onChange({
          value: this.state.value,
        });
      change &&
        onAnalytics &&
        onAnalytics({
          ...change,
        });
    }
  }
  handleOnKeyDown(e) {
    this.setState({
      valueBeforeKeyUp: e.target.value,
      focusCalled: false,
    });
  }
  handleOnKeyUp(e) {
    if (e.key === 'Enter') {
      this.handleOnChange(e);
      this.handleBlur();
    }
  }

  render() {
    const { focused } = this.state;
    const { errorMessage, className = '', formatter, onAnalytics, onAction, mask = {}, sideAction, impactOn, row, actionType, startAdornment, endAdornment, userData, doFocus, ...rest } = this.props;
    const finalAction = getValue(this, sideAction, row);
    const formattedValue = this.applyMask(this.state.value);
    const testId = idFromLabel(rest.label);
    const finalInputProps:any = {};
    if (startAdornment) {
      finalInputProps.startAdornment = <InputAdornment position="start">{startAdornment}</InputAdornment>;
    }
    if (endAdornment) {
      finalInputProps.endAdornment = <InputAdornment position="end">{endAdornment}</InputAdornment>;
    }
    return (
      <div className={`sq-input-field${focused ? ' sq-input-field--focused' : ''} ${className}`} data-testid={testId}>
        <div className="sq-input-field__container">
          <TextField
            variant="outlined"
            {...rest}
            inputRef={ input => this.input = input }
            component={undefined}
            className="sq-input-field__input"
            inputProps={{
              id: `${this.state.identifier}_input`,
              'aria-label': rest.label,
              'aria-describedby': this.state.identifier,
              'data-testid': `${testId}_input`,
              'aria-invalid': !!errorMessage,
            }}
            InputProps={{
              ...finalInputProps,
            }}
            error={rest.error}
            value={formattedValue}
            onChange={this.handleOnChange}
            onKeyPress={this.handleOnKeyUp}
            onKeyDown={this.handleOnKeyDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {finalAction && <div className="sq-input-field__side-actions">{finalAction}</div>}
        </div>
        {errorMessage && (
          <div id={this.state.identifier} style={{ display: focused ? 'none' : 'block' }} className="sq-input-field--error">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
}

Input.propTypes = {
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  formatter: PropTypes.object,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
};
export { TextField as StyledTextField };
export default Input;
