import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextareaAutosize } from '@mui/material';


class TextareaField extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      focused: false,
      hasChanged: false
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
  }

  handleOnChange(evt) {
    this.setState({
      value: evt.target.value,
      hasChanged: true
    });
    const { onKeyPress } = this.props;
    onKeyPress &&
      onKeyPress({
        value: evt.target.value
      });
  }

  componentDidMount() {
    this.setState({
      value: this.props.value !== undefined ? this.props.value : ''
    });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value
      });
    }
  }

  handleFocus() {
    this.setState({
      focused: true
    });
  }

  handleBlur() {
    const { onBlur, onChange } = this.props;
    this.setState({
      focused: false
    });
    onBlur &&
      onBlur({
        value: this.state.value
      });
    onChange &&
      onChange({
        value: this.state.value
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
    const { errorMessage, label, className = '', formatter, rows = 3, ...rest } = this.props;
    let formatteedValue = this.state.value;
    return (
      <div className={`sq-textarea-field${focused ? ' sq-textarea-field--focused' : ''} ${className}`}>
        {label && <label htmlFor="">{label}</label>}
        <TextareaAutosize
          className="sq-textarea-field__textarea"
          variant="outlined"
          minRows={rows}
          {...rest}
          error={rest.error}
          value={formatteedValue}
          onChange={this.handleOnChange}
          onKeyPress={this.handleOnKeyUp}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {!focused && <div className="sq-textarea-field--error">{errorMessage}</div>}
      </div>
    );
  }
}

TextareaField.propTypes = {
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  formatter: PropTypes.object,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func
};
export default TextareaField;
