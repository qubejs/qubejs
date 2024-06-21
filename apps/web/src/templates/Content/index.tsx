import { Component } from 'react';
import PropTypes from 'prop-types';
import './content.scss';

class Content extends Component {
  props: any;
  static propTypes: any;
  componentDidUpdate(prevprops) {}

  render() {
    const { children, pageData = {} } = this.props;
    return (
      <div className={`sq-layout ${pageData.wrapperClassName || 'sq-layout--default'}`}>
        <div className="container-fluid">{children}</div>
      </div>
    );
  }
}

Content.propTypes = {
  children: PropTypes.any,
  pageData: PropTypes.object,
  userStore: PropTypes.object,
  data: PropTypes.object,
};

export default Content;
