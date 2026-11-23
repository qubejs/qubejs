import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../../reui/ui/badge';
import { Button } from '../../reui/ui/button';
import { cn } from '../../reui/lib/utils';
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
    const { className = '', classes = {}, showLogo = true, enableDrawer, rightMenu = [], logo = {}, color } = this.props;
    return (
      <div className={`sq-navigation__app-bar ${className}`}>
        <header
          data-slot="app-bar"
          className={cn(
            'flex h-14 items-center gap-2 border-b px-4',
            color === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
          )}
        >
          {showLogo && <Icon name="logo-full" variant="normal" size="wide" {...logo} />}
          <div className="sq-d-flex__grow-yes flex-1"></div>
          <div className="sq-navigation__right-menu flex items-center gap-1">
            {rightMenu.length > 0 &&
              rightMenu.map((item, idx) => {
                const { onClick } = item;
                return (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label={item.text || item.icon}
                    onClick={() => {
                      const result = onClick && onClick(item);
                      if (result !== false) {
                        this.handleRightMenuClick(item);
                      }
                    }}
                  >
                    <Icon name={item.icon} variant="normal" />
                    {!!item.total && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">
                        {item.total}
                      </Badge>
                    )}
                  </Button>
                );
              })}
          </div>
          {enableDrawer && (
            <Button variant="ghost" size="icon" onClick={this.handleMenuClick} className={classes.menuButton} aria-label="Menu">
              <Icon name="menu" variant="normal" />
            </Button>
          )}
        </header>
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
  showLogo: PropTypes.bool,
};

export default MenuAppBar;
