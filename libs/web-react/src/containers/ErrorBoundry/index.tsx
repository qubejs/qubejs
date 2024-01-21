import React from 'react';
import PropTypes from 'prop-types';
import * as utils from '../../utils';

class ErrorBoundry extends React.Component {
  static propTypes: any;
  state: any;
  props: any;
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    console.log('@@root:error', error);
    // You can also log the error to an error reporting service
    this.setState({
      hasError: true,
    });
  }

  render() {
    const { LinkButton }: any = utils.storage.components.get();
    const {
      header = 'Unexpected error occured',
      body = 'There is some error on this page please contact administrator.',
      redirectUrl = '/',
      buttonText = 'Refresh',
      buttonProps = {},
    }: any = this.props;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundry container">
          <div className="container-form">
            <h1>{header}</h1>
            <p>{body}</p>
            <LinkButton
              buttonText={buttonText}
              to={redirectUrl}
              type="Button"
              variant="outlined"
              {...buttonProps}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundry.propTypes = {
  children: PropTypes.any,
  header: PropTypes.string,
  body: PropTypes.string,
  redirectUrl: PropTypes.string,
  buttonProps: PropTypes.object,
  buttonText: PropTypes.string,
};

export default ErrorBoundry;
