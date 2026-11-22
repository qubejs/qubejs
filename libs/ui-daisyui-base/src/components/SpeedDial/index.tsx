import { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusIcon } from 'lucide-react';
import { utils } from '@qubejs/web-react';
import { Button } from '../../daisy/ui/button';
import { Tooltip } from '../../daisy/compat/tooltip';
import { cn } from '../../daisy/lib/utils';

const { getValue } = utils.properties;

const SQSpeedDial = ({ actions = [], className = '', label = '', row, column }: any) => {
  const [open, setOpen] = useState(false);
  const finalActions = getValue(this, actions, row, column) || [];

  return (
    <div
      className={`sq-speed-dial ${className}`}
      onMouseLeave={() => setOpen(false)}
    >
      <div className={`sq-speed-dial__speed-dial flex flex-col-reverse items-center gap-2`}>
        <Button
          size="icon-lg"
          className="size-12 rounded-full shadow-lg"
          aria-label={label}
          aria-expanded={open}
          onMouseEnter={() => setOpen(true)}
          onClick={() => setOpen(!open)}
        >
          <PlusIcon className={cn('size-5 transition-transform', open && 'rotate-45')} />
        </Button>
        {open &&
          finalActions.map((action) => (
            <Tooltip key={action.name} title={action.name} placement="left">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-md"
                aria-label={action.name}
                onClick={() => setOpen(false)}
              >
                {action.icon}
              </Button>
            </Tooltip>
          ))}
      </div>
    </div>
  );
};

SQSpeedDial.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  row: PropTypes.object,
  column: PropTypes.object,
  onClick: PropTypes.func,
  onAction: PropTypes.func,
  actions: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
};

export default SQSpeedDial;
