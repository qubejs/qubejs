import React from 'react';
import PropTypes from 'prop-types';
import Alert from '../Alert';

class ErrorBoundry extends React.Component {
  props: any;
  state: any;
  static propTypes;
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    console.log('@@@@@', error);
    // You can also log the error to an error reporting service
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundry mt-wide mb-wide">
          <Alert type="error" message="Some error has occured" />
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
