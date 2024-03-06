import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Icon from '../Icon';


class MenuAppBar extends React.Component {
  static propTypes: any;
  props: any;
  state: any;
  constructor(props) {
    super(props);
    this.state = {};

    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick() {
    const { onMenuClick } = this.props;
    onMenuClick && onMenuClick();
  }

  handleRightMenuClick(item) {
    const { onRightMenuClick } = this.props;
    onRightMenuClick && onRightMenuClick(item);
  }

  render() {
    const { className = '', classes = {}, showLogo = true, enableDrawer, rightMenu = [], logo = {} } = this.props;
    return (
      <div className={`sq-navigation__app-bar ${className}`}>
        <AppBar position="static" color={this.props.color}>
          <Toolbar>
            {showLogo && <Icon name="logo-full" variant="normal" size="wide" {...logo} />}
            <div className="sq-d-flex__grow-yes"></div>
            <div className="sq-navigation__right-menu">
              {rightMenu.length > 0 &&
                rightMenu.map((item, idx) => {
                  const { onClick } = item;
                  return (
                    <IconButton
                      key={idx}
                      aria-label="show 4 new mails"
                      color="inherit"
                      onClick={() => {
                        const result = onClick && onClick(item);
                        if (result !== false) {
                          this.handleRightMenuClick(item);
                        }
                      }}
                    >
                      <Badge badgeContent={item.total} color="secondary">
                        <Icon name={item.icon} variant="normal" />
                      </Badge>
                    </IconButton>
                  );
                })}
            </div>
            {enableDrawer && <IconButton onClick={this.handleMenuClick} edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
              <Icon name="menu" variant="normal" />
            </IconButton>}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  onMenuClick: PropTypes.func,
  onRightMenuClick: PropTypes.func,
  classes: PropTypes.object,
  color: PropTypes.string,
  rightMenu: PropTypes.array,
  open: PropTypes.bool,
  showLogo: PropTypes.bool
};

export default MenuAppBar;
