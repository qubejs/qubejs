import React from 'react';
import PropTypes from 'prop-types';
import { storage } from '../../utils';

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
    const { Alert } = storage.components.get();
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundry mt-wide mb-wide">
          {Alert && <Alert type="error" message="Some error has occured" />}
          {!Alert && <div className='sq-error'>Some error has occured</div>}
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
