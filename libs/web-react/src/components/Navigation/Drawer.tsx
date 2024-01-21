import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import IconExpandLess from '@mui/icons-material/ExpandLess';
import IconExpandMore from '@mui/icons-material/ExpandMore';

import Icon from '../Icon';
import { translate } from '../../utils/translate';

class TemporaryDrawer extends React.Component {
  static propTypes: any;
  props: any;
  state: any;
  constructor(props) {
    super(props);
    this.state = {
      open: {},
    };
    this.handleOnClose = this.handleOnClose.bind(this);
  }

  handleOnClose() {
    const { onClose }: any = this.props;
    onClose && onClose();
  }
  handleOnMenuItemClick(item) {
    const { onMenuItemClick }:any = this.props;
    onMenuItemClick && onMenuItemClick(item);
    this.handleOnClose();
  }

  render() {
    const { classes, className = '', options = [], appVersion, logoIcon = {} }: any = this.props;

    return (
      <div className="sq-global-navigation-drawer">
        <Drawer className={`${classes.root} ${className}`} anchor="right" open={this.props.open} onClose={this.handleOnClose}>
          <div className={classes.fullList} role="presentation" onKeyDown={this.handleOnClose}>
            <List className={classes.fullList}>
              <ListItem
                className={`${classes.logoItem} sq-global-navigation-drawer__logo-item `}
                onClick={() =>
                  this.props.logoUrl &&
                  this.handleOnMenuItemClick({
                    to: this.props.logoUrl,
                  })
                }
              >
                <ListItemIcon>
                  <Icon name="logo-full" size="wide" {...logoIcon} />
                </ListItemIcon>
              </ListItem>
              <Divider />
              {options.map((item, index) => {
                if (item === '-') {
                  return <Divider key={index} />;
                }
                const isExpandable = item.children && item.children.length > 0;
                if (!isExpandable) {
                  return (
                    <ListItem
                      button
                      key={index}
                      onClick={() => {
                        const result = item.onClick && item.onClick();
                        if (result !== false) {
                          this.handleOnMenuItemClick(item);
                        }
                      }}
                    >
                      <ListItemIcon>{item.icon && <Icon name={item.icon} size={item.iconSize} />}</ListItemIcon>
                      <ListItemText primary={translate(item.text)} />
                    </ListItem>
                  );
                } else {
                  return (
                    <Fragment key={index}>
                      <ListItem
                        button
                        key={index}
                        onClick={() => {
                          this.setState({
                            open: {
                              ...this.state.open,
                              [index]: !this.state.open[index],
                            },
                          });
                        }}
                      >
                        <ListItemIcon>{item.icon && <Icon name={item.icon} size={item.iconSize} />}</ListItemIcon>
                        <ListItemText primary={translate(item.text)} />
                        {isExpandable && !this.state.open[index] && <IconExpandMore />}
                        {isExpandable && this.state.open[index] && <IconExpandLess />}
                      </ListItem>
                      <Collapse in={this.state.open[index]} timeout="auto" unmountOnExit>
                        <Divider />
                        <List component="div" disablePadding>
                          {item.children.map((item, index) => (
                            <ListItem
                              button
                              key={index}
                              onClick={() => {
                                const result = item.onClick && item.onClick();
                                if (result !== false) {
                                  this.handleOnMenuItemClick(item);
                                }
                              }}
                            >
                              <ListItemIcon>{item.icon && <Icon name={item.icon} size={item.iconSize} />}</ListItemIcon>
                              <ListItemText primary={translate(item.text)} />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </Fragment>
                  );
                }
              })}
            </List>
            <div className="sq-global-navigation-drawer__app-version">
              {appVersion && translate('v')}
              {appVersion}
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  onClose: PropTypes.func,
  classes: PropTypes.object,
  logoUrl: PropTypes.string,
  onMenuItemClick: PropTypes.func,
  open: PropTypes.bool,
  appVersion: PropTypes.string,
  options: PropTypes.array,
};

export default TemporaryDrawer;
