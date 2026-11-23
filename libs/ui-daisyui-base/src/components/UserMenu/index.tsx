import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, AvatarFallback } from '../../daisy/ui/avatar';
import { Button } from '../../daisy/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../daisy/ui/dropdown-menu';
import { Tooltip } from '../../daisy/compat/tooltip';
import Icon from '../Icon';
import { hasPermission } from '../LeftNavigation/helpers';

const UserMenu = ({ user, onAction, listOfActions = [], buttonClassName = '', className = '', permissions }: any) => {
  const handleItemClick = (e, item) => {
    onAction && onAction(item);
  };
  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <div className={`sq-user-menu ${className}`}>
      <DropdownMenu>
        <Tooltip title={fullName}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-lg" className={`rounded-full ${buttonClassName}`} aria-label={fullName}>
              <Avatar className="size-8">
                <AvatarFallback>
                  {user?.firstName ? user?.firstName?.substr(0, 1).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent align="end" className="sq-user-menu__menu min-w-[100px]">
          <DropdownMenuLabel className="sq-user-menu__header">
            <div className="sq-user-menu__user-name">{fullName}</div>
            <div className="sq-user-menu__email text-xs font-normal text-muted-foreground">{`${user?.email}`}</div>
          </DropdownMenuLabel>
          {listOfActions.map((action, key) => {
            if (action === 'divider') {
              return <DropdownMenuSeparator key={key} />;
            }
            const isAllowed = hasPermission(action, { permissions });
            if (!isAllowed) {
              return null;
            }
            return (
              <DropdownMenuItem key={key} onSelect={(e) => handleItemClick(e, action)}>
                <Icon size={action.iconSize} className={action.className} name={action.iconName} />
                {action.buttonText}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
UserMenu.propTypes = {
  user: PropTypes.object,
  onAction: PropTypes.func,
  listOfActions: PropTypes.array,
  permissions: PropTypes.array,
  className: PropTypes.string,
};
export default UserMenu;
