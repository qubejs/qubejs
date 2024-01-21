import { Component } from 'react';
import PropTypes from 'prop-types';

class BaseContainer extends Component {
  props: any;
  analytics: any;
  state: any;
  static propTypes: any;
  trackPageView() {
    const { load } = this.analytics || {};
    const { onAnalytics } = this.props;
    if (load) {
      onAnalytics &&
        onAnalytics({
          type: 'pageview',
          ...load,
        });
    }
  }

  trackEvent({ eventName, category, section, action, label }) {
    const { onAnalytics } = this.props;
    eventName &&
      onAnalytics &&
      onAnalytics({
        type: 'event',
        eventName,
        category,
        section,
        action,
        label,
      });
  }

  render() {
    return (
      <div className="container-fluid">
        <h1>Not Implemented</h1>
      </div>
    );
  }
}

BaseContainer.propTypes = {
  onAnalytics: PropTypes.func,
  userStore: PropTypes.object,
  commonStore: PropTypes.object,
};

export default BaseContainer;
