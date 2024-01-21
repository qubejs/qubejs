import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';

function getText(html) {
  var divContainer = document.createElement('div');
  divContainer.innerHTML = html;
  return divContainer.textContent || divContainer.innerText || '';
}

class BasicRTE extends React.Component {
  constructor() {
    super();
    this.state = {
      value: RichTextEditor.createEmptyValue(),
      focused: false,
      hasChanged: false,
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(value) {
    const html = value.toString('html');
    const hasText = getText(html);
    this.setState({
      value: value,
      hasChanged: true,
    });
    const { onChange } = this.props;

    onChange &&
      onChange({
        value: hasText && html,
      });
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        value: RichTextEditor.createValueFromString(this.props.value, 'html'),
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.state.focused && prevProps.value !== this.props.value) {
      this.setState({
        value: RichTextEditor.createValueFromString(this.props.value, 'html'),
      });
    }
  }

  handleFocus() {
    this.setState({
      focused: true,
    });
  }

  handleBlur() {
    const { onBlur, onChange } = this.props;
    this.setState({
      focused: false,
    });
  }

  render() {
    const { focused } = this.state;
    const {
      label,
      className = '',
      formatter,
      value,
      error,
      errorMessage,
      ...rest
    } = this.props;

    return (
      <div
        className={`sq-basic-rte${
          focused ? ' sq-basic-rte--focused' : ''
        } ${className}`}
      >
        {label && <label htmlFor="">{label}</label>}
        <RichTextEditor
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleOnChange}
          className={`sq-basic-rte__editor`}
          defaultValue={this.props.value}
          value={this.state.value}
        />
        {!focused && error && (
          <div className="sq-textarea-field--error">{errorMessage}</div>
        )}
      </div>
    );
  }
}

BasicRTE.propTypes = {
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  formatter: PropTypes.object,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
};
export default BasicRTE;
