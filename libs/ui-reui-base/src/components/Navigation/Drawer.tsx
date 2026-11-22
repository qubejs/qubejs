import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { utils } from '@qubejs/web-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../reui/ui/sheet';
import { Separator } from '../../reui/ui/separator';
import { Collapsible, CollapsibleContent } from '../../reui/ui/collapsible';
import { NavItem } from '../../reui/compat/nav-item';
import Icon from '../Icon';

const { translate } = utils.translate;

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
    const { onMenuItemClick }: any = this.props;
    onMenuItemClick && onMenuItemClick(item);
    this.handleOnClose();
  }

  renderItem(item, index, inset = false) {
    return (
      <NavItem
        key={index}
        inset={inset}
        onClick={() => {
          const result = item.onClick && item.onClick();
          if (result !== false) {
            this.handleOnMenuItemClick(item);
          }
        }}
      >
        <span className="flex w-6 shrink-0">{item.icon && <Icon name={item.icon} size={item.iconSize} />}</span>
        <span className="flex-1">{translate(item.text)}</span>
      </NavItem>
    );
  }

  render() {
    const { classes = {}, className = '', options = [], appVersion, logoIcon = {} }: any = this.props;

    return (
      <div className="sq-global-navigation-drawer">
        <Sheet open={!!this.props.open} onOpenChange={(next) => !next && this.handleOnClose()}>
          <SheetContent side="right" className={`${classes.root || ''} ${className} gap-0 p-0`}>
            <SheetHeader className="p-0">
              <SheetTitle asChild>
                <button
                  type="button"
                  className={`${classes.logoItem || ''} sq-global-navigation-drawer__logo-item flex p-4`}
                  onClick={() =>
                    this.props.logoUrl &&
                    this.handleOnMenuItemClick({
                      to: this.props.logoUrl,
                    })
                  }
                >
                  <Icon name="logo-full" size="wide" {...logoIcon} />
                </button>
              </SheetTitle>
              <SheetDescription className="sr-only">Navigation</SheetDescription>
            </SheetHeader>
            <Separator />
            <div className={`${classes.fullList || ''} flex flex-1 flex-col gap-0.5 overflow-y-auto p-2`} role="presentation">
              {options.map((item, index) => {
                if (item === '-') {
                  return <Separator key={index} className="my-1" />;
                }
                const isExpandable = item.children && item.children.length > 0;
                if (!isExpandable) {
                  return this.renderItem(item, index);
                }
                const isOpen = !!this.state.open[index];
                return (
                  <Fragment key={index}>
                    <NavItem
                      aria-expanded={isOpen}
                      onClick={() => {
                        this.setState({
                          open: {
                            ...this.state.open,
                            [index]: !isOpen,
                          },
                        });
                      }}
                    >
                      <span className="flex w-6 shrink-0">{item.icon && <Icon name={item.icon} size={item.iconSize} />}</span>
                      <span className="flex-1">{translate(item.text)}</span>
                      {isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                    </NavItem>
                    <Collapsible open={isOpen}>
                      <CollapsibleContent className="sq-global-navigation-drawer__nested-list flex flex-col gap-0.5">
                        {item.children.map((child, childIndex) => this.renderItem(child, childIndex, true))}
                      </CollapsibleContent>
                    </Collapsible>
                  </Fragment>
                );
              })}
            </div>
            <div className="sq-global-navigation-drawer__app-version p-4 text-xs text-muted-foreground">
              {appVersion && translate('v')}
              {appVersion}
            </div>
          </SheetContent>
        </Sheet>
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
