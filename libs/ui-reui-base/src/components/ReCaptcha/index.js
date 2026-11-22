import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';

class ReCaptcha extends React.Component {
  constructor() {
    super();
    this.state = {
      value: ''
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(value) {
    this.setState({
      value: value
    });
    const { onKeyPress, onChange } = this.props;
    onKeyPress &&
      onKeyPress({
        value: value
      });
    onChange &&
      onChange({
        value: value
      });
  }

  render() {
    const { focused } = this.state;
    const { errorMessage, className = '', sitekey } = this.props;
    return (
      <div className={`sq-re-captcha ${className}`}>
        <div className="sq-re-captcha__elm">
          <ReCAPTCHA sitekey={sitekey} onChange={this.handleOnChange} />
        </div>
        {!focused && <div className="sq-textarea-field--error">{errorMessage}</div>}
      </div>
    );
  }
}

ReCaptcha.propTypes = {
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  formatter: PropTypes.object,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func
};
export default ReCaptcha;
