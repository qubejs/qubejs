import React from 'react';
import PropTypes from 'prop-types';
import GlobalNavigation from '../../components/GlobalNavigation';
import Footer from '../../components/Footer';
import BaseContainer from '../../containers/BaseContainer';

class Homepage extends BaseContainer {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, pageData = {}, data = {}, store } = this.props;
    const { metaData = {}, siteMap = {} } = data;
    let props = {};
    if (!store.authentication?.currentUser) {
      props = { ...siteMap.siteMap.globalNavigation };
    } else {
      props = { ...siteMap.siteMap.globalNavigationLoggedIn };
    }
    return (
      <div
        className={`sq-content-page sq-content-page--header-footer-body  ${
          pageData.className || ''
        }`}
      >
        <header>
          <GlobalNavigation
            logo={siteMap.logo}
            items={metaData.navigation}
            {...props}
          />
        </header>
        {children}
        <footer>
          <Footer
            logo={siteMap.logo}
            items={metaData.navigation}
            {...siteMap.siteMap.globalFooter}
          />
        </footer>
      </div>
    );
  }
}

Homepage.propTypes = {
  children: PropTypes.any,
  pageData: PropTypes.object,
  userStore: PropTypes.object,
  data: PropTypes.object,
};

export default Homepage;
