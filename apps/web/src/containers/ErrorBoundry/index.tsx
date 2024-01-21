import React from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';

class ErrorBoundry extends React.Component {
  props: any;
  state: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    /* eslint-disable */
    console.log('@@@@@', error);
    // You can also log the error to an error reporting service
    this.setState({
      hasError: true,
    });
  }

  render() {
    const { LinkButton } = utils.storage.components.get();
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundry container">
          <div className="container-form">
            <h1>Unexpected error occured</h1>
            <p>
              There is some error on this page please contact administrator.
            </p>
            <LinkButton
              buttonText="Go to Dashboard"
              to="dashboard"
              type="Button"
              variant="outlined"
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
};

export default ErrorBoundry;
