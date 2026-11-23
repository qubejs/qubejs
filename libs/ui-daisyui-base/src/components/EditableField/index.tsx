import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import { Button } from '../../daisy/ui/button';
import { Popover, PopoverAnchor, PopoverContent } from '../../daisy/ui/popover';
import Icon from '../Icon';

const { getValue } = utils.properties;
const { storage } = utils;

const EditableField = ({ column, row, viewType = 'Default', editType = 'Input', value, editValue, classes = {}, viewProps = {}, editProps = {}, className = '', onChange, onClick, onAction, onAnalytics, onBlur, onKeyPress, formatter = {}, ...rest }: any) => {
  const CompMap = {
    ...storage.components.get(),
  };
  const [open, setOpen] = useState(false);
  const [changedValue, setChangeValue] = useState({
    value,
  });

  useEffect(() => {
    setChangeValue({
      value,
    });
  }, [value]);

  const handleChange = (data) => {
    setChangeValue(data);
  };

  const applyChange = () => {
    onChange && onChange(changedValue);
  };

  const CmpToRender = CompMap[viewType] || CompMap.Default;
  const CmpToEdit = CompMap[editType] || CompMap.Input;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={`sq-editable-field ${getValue(this, className, row)}`} onDoubleClick={() => setOpen(true)}>
          <div className="sq-editable-field__cmp">
            {<CmpToRender value={value} {...rest} row={row} column={column} onAnalytics={onAnalytics} />}
            <div className="sq-editable-field__edit">
              <Button variant="ghost" size="icon-xs" aria-label="edit" onClick={() => setOpen(true)}>
                <Icon name="edit" size="xs" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="bottom"
        className={`sq-editable-field__pop-over w-auto p-5 ${getValue(this, classes.popover, row) || ''}`}
      >
        {<CmpToEdit {...editProps} value={changedValue?.value !== undefined ? changedValue?.value : editValue || value} onChange={handleChange} onKeyPress={onKeyPress} onAnalytics={onAnalytics} />}
        <div className="sq-editable-field__actions flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="apply"
            onClick={() => {
              applyChange();
              setOpen(false);
            }}
          >
            <Icon name="check" color={'success'} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="cancel"
            onClick={() => {
              setChangeValue({ value });
              setOpen(false);
            }}
          >
            <Icon name="close" color={'error'} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
storage.components.set({
  EditableField,
});

EditableField.propTypes = {
  column: PropTypes.object,
  value: PropTypes.any,
  row: PropTypes.object,
  formatter: PropTypes.object,
  onAction: PropTypes.func,
  onChange: PropTypes.func,
  onAnalytics: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  beforeRender: PropTypes.func,
};

export default EditableField;
