import React from 'react';
import PropTypes from 'prop-types';
import { Textarea } from '../../daisy/ui/textarea';
import { Label } from '../../daisy/ui/label';
import { pickDomProps } from '../../daisy/compat/dom-props';


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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { errorMessage, label, className = '', formatter, rows = 3, error, minRows, maxRows, variant, ...rest } = this.props;
    let formatteedValue = this.state.value;
    return (
      <div className={`sq-textarea-field${focused ? ' sq-textarea-field--focused' : ''} ${className}`}>
        {label && <Label className="mb-1.5">{label}</Label>}
        <Textarea
          className="sq-textarea-field__textarea"
          rows={rows}
          {...pickDomProps(rest)}
          aria-invalid={error || !!errorMessage || undefined}
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
