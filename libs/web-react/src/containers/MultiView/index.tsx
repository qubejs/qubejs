import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route } from 'react-router-dom';
import { components } from '../../utils/storage';
import { redirectTo } from '../../utils/redirect';
import browser from '../../utils/browser';

class MultiView extends Component {
  props:any;
  state:any;
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { BottomNavigation } = components.get();
    const { className = '', views = [], defaultView, ...rest } = this.props;
    const viewName = defaultView || (views.length > 0 ? views[0].name : '');
    const { routeName, location = {} } = rest;
    const { pathname } = location;
    return (
      <div className={`multi-view screen ${className}`}>
        <div className="screen__content">
          <Routes>
            {views.map((view) => {
              const { container: Container, name } = view;
              return (
                <Route
                  key={name}
                  path={`${routeName}/${name}`}
                  element={<Container {...rest} />}
                />
              );
            })}
          </Routes>
        </div>
        <div className="screen__footer">
          <BottomNavigation
            onChange={(value) => {
              redirectTo(value);
            }}
            iconOnly={browser.breakpoints.down('sm')}
            value={pathname}
            links={views.map((view) => {
              return {
                label: view.label,
                icon: view.iconName,
                value: `${routeName}/${view.name}`
              };
            })}
          />
        </div>
      </div>
    );
  }
}

MultiView.propTypes = {
  commonStore: PropTypes.object,
  authStore: PropTypes.object,
  store: PropTypes.object
};

export default MultiView;
