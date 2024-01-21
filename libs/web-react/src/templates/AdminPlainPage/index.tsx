import React from 'react';
import PropTypes from 'prop-types';
// import GlobalNavigation from '../../components/ui/GlobalNavigation';
// import Footer from '../../components/ui/Footer';
import BaseContainer from '../../containers/BaseContainer';
import './_admin-plain.scss';
import Icon from '../../components/Icon';
class AdminPlainPage extends BaseContainer {
  props:any;
  state:any;
  constructor(props:any) {
    super(props);
  }

  render() {
    const { children, pageData = {}, data = {}, store } = this.props;
    const { metaData = {}, siteMap = {} } = data;
    return (
      <div className={`sq-admin-plain ${pageData.className || ''}`}>
        <div
          className="sq-admin-plain__left"
          style={{
            backgroundImage: `url('/client/assets/imgs/building.png')`,
          }}
        ></div>
        <div className="sq-admin-plain__right">
          <div className="sq-admin-plain__body">
            <header className="sq-admin-plain__header">
              <div className="sq-admin-plain__logo">
                <Icon name="logo-wide" size="auto" />
              </div>
            </header>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

AdminPlainPage.propTypes = {
  children: PropTypes.any,
  pageData: PropTypes.object,
  userStore: PropTypes.object,
  data: PropTypes.object,
};

export default AdminPlainPage;
