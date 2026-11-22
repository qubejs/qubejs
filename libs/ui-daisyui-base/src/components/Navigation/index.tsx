import React from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';

import AppBar from './AppBar';
import Drawer from './Drawer';

const { redirectTo } = utils.redirect;
const common = utils.common;

class SQNavigation extends React.Component {
  state: any;
  props: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.onMenuClick = this.onMenuClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
  }

  onMenuClick(item) {
    this.setState({
      open: !this.state.open
    });
  }
  handleClose() {
    this.setState({
      open: false
    });
  }

  onMenuItemClick(item) {
    const { onMenuItemClick, onAnalytics } = this.props;
    const { analytics = {} } = this.props;
    const { click } = analytics;
    onMenuItemClick && onMenuItemClick(item);
    if (item.to) {
      redirectTo(item.to, item.urlParams);
    }
    click && onAnalytics && onAnalytics(click);
  }

  render() {
    const { className = '', classes = {}, enableDrawer = true, logo } = this.props;
    return (
      <nav className={`sq-navigation ${className}`}>
        <AppBar
          className={common.toStringBlank(classes.appBar)}
          color={this.props.appBarColor}
          logo={logo}
          onMenuClick={this.onMenuClick}
          enableDrawer={enableDrawer}
          rightMenu={this.props.isLoggedIn ? this.props.appRightMenu : this.props.rightMenu}
          onRightMenuClick={this.onMenuItemClick}
        />
        {enableDrawer && (
          <Drawer
            logoUrl=""
            logo={logo}
            classes={classes}
            className={common.toStringBlank(classes.drawer)}
            logoIcon={this.props.logoIcon}
            open={this.state.open}
            onClose={this.handleClose}
            onMenuItemClick={this.onMenuItemClick}
            appVersion={this.props.appVersion}
            options={this.props.options}
          />
        )}
      </nav>
    );
  }
}

SQNavigation.propTypes = {
  isLoggedIn: PropTypes.bool,
  className: PropTypes.string,
  onLogout: PropTypes.func,
  appVersion: PropTypes.string,
  appBarColor: PropTypes.string
};

export default SQNavigation;
