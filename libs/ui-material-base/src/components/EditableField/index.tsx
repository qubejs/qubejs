import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { utils } from '@qubejs/web-react';
import Icon from '../Icon';

const { getValue } = utils.properties;
const { storage } = utils;

const EditableField = ({ column, row, viewType = 'Default', editType = 'Input', value, classes = {}, viewProps = {}, editProps = {}, className = '', onChange, onClick, onAction, onAnalytics, onBlur, onKeyPress, formatter = {}, ...rest } :any) => {
  const editableRef = useRef();
  const CompMap = {
    ...storage.components.get(),
  };

  const [changedValue, setChangeValue] = useState({
    value,
  });

  useEffect(() => {
    setChangeValue({
      value
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
    <PopupState variant="popover">
      {(popupState) => (
        <div className={`sq-editable-field ${getValue(this, className, row)}`} onDoubleClick={() => popupState.open()} ref={editableRef}>
          <div className="sq-editable-field__cmp">
            {<CmpToRender value={value} {...rest} row={row} column={column} onAnalytics={onAnalytics} />}
            {
              <div className="sq-editable-field__edit">
                <IconButton {...bindTrigger(popupState)}>
                  <Icon name="edit" size="xs" />
                </IconButton>
              </div>
            }
            <Popover
              {...bindPopover(popupState)}
              anchorEl={editableRef.current}
              classes={{
                root: 'sq-editable-field__pop-over-root',
              }}
              PaperProps={{
                classes: {
                  root: `sq-editable-field__pop-over ${getValue(this, classes.popover, row)}`,
                },
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  boxShadow: '0px 4px 16px rgba(25, 25, 25, 0.12)',
                  borderRadius: '8px',
                  padding: '20px',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {<CmpToEdit {...editProps} value={changedValue?.value !== undefined ? changedValue?.value : value} onChange={handleChange} onKeyPress={onKeyPress} onAnalytics={onAnalytics} />}
              <div className="sq-editable-field__actions">
                <IconButton
                  onClick={() => {
                    applyChange();
                    popupState.close();
                  }}
                >
                  <Icon name="check" color={'success'} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setChangeValue({ value });
                    popupState.close();
                  }}
                >
                  <Icon name="close" color={'error'} />
                </IconButton>
              </div>
            </Popover>
          </div>
        </div>
      )}
    </PopupState>
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
