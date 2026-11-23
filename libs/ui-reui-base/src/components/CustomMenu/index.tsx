import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../reui/ui/dropdown-menu';
import Icon from '../Icon';
import Button from '../Button';

const CustomMenu = ({ disabled, value, defaultText = 'Untitled', type = 'Button', header = 'No header', subHeader = '', options = [], iconName = 'Save', iconSize = 'normal', className = '', title, onAction }: any) => {
  const [open, setOpen] = React.useState(false);

  const handleItemClick = (e, item) => {
    onAction && onAction({ value }, item);
    setOpen(false);
  };
  return (
    <div className={`sq-custom-menu ${className}`}>
      <DropdownMenu open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <span className="inline-block">
            <Button
              disabled={disabled}
              buttonText={value || defaultText}
              variant="outlined"
              iconName={'arrow-down'}
              iconSize={'small'}
              iconDirection="right"
            />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="sq-custom-menu__menu min-w-[100px]">
          <DropdownMenuLabel className="sq-custom-menu__header">
            <div className="sq-custom-menu__user-name">{header}</div>
            {subHeader && <div className="sq-custom-menu__email text-xs font-normal text-muted-foreground">{subHeader}</div>}
          </DropdownMenuLabel>
          {options.map((action, key) => {
            if (action === 'divider') {
              return <DropdownMenuSeparator key={key} />;
            }
            return (
              <DropdownMenuItem
                key={key}
                disabled={action.disabled}
                onSelect={(e) => handleItemClick(e, action)}
              >
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

export default CustomMenu;
