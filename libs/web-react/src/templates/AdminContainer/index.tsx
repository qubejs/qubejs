import React from 'react';
import PropTypes from 'prop-types';
import BaseContainer from '../../containers/BaseContainer';
import config from '../../admin.config';
import { setUrlMapping } from '../../utils/redirect';
import { addValidator } from '../../utils/validator';
setUrlMapping(config.urlMapping);

addValidator('hasAdminMatchingUrl', (value, { setName }) => {
  let currentUrl = window.location.pathname;
  let isAllowed = false;
  config.urls[setName]?.forEach((item) => {
    if (new RegExp(item).test(currentUrl)) {
      isAllowed = true;
    }
  });
  return isAllowed;
});

class AdminContainer extends BaseContainer {
 
  render() {
    return (
      <div className="container-fluid">
        <h1>Not Implemented</h1>
      </div>
    );
  }
}

AdminContainer.propTypes = {
  onAnalytics: PropTypes.func,
  userStore: PropTypes.object,
  commonStore: PropTypes.object,
};

export default AdminContainer;
