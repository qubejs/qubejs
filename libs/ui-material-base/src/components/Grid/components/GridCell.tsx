import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import Tooltip from '@mui/material/Tooltip';

const { getFormatters } = utils.format;
const { getValue } = utils.properties;
const { storage } = utils;

const GridCell = ({ column = {}, row, value, onChange, style, onClick, onAction, onAnalytics, onBlur, errors, onKeyPress, formatter = {} }:any) => {
  const CompMap = {
    ...storage.components.get(),
  };
  const _onChange = (newValue) => {
    onChange && onChange(column, newValue);
  };
  const _onClick = (newValue) => {
    onClick && onClick(column, newValue);
  };
  const _onAction = (evt, newValue) => {
    onAction && onAction(column, newValue);
  };
  const _Blur = (value) => {
    onBlur && onBlur(column, value);
  };
  const _onKeyPress = (value) => {
    onKeyPress && onKeyPress(column, value);
  };
  const focusedProps = column.beforeRender && column.beforeRender(column, value, row);
  const { cmpType, className = '', component, render, tooltip = {} }: any = { ...column, ...focusedProps, component: {...column.component, ...(focusedProps?.component || {}), } };
  const CellComponent = CompMap[cmpType] || CompMap.Text;
  const { type, ...restFormatter }:any = formatter;
  let customValue = value;
  if (render) {
    customValue = render(value, column, row);
  }
  const formatters = getFormatters();
  const newValue = (type && formatters[type] && formatters[type](customValue, restFormatter, row, { column })) || customValue;
  const { title, ...tooltipProps } = tooltip;
  const finalValTitle = getValue(this, title, row);
  return (
    <div className={`sq-grid__data-cell ${getValue(this, className, row)}`} role="grid-cell" style={style}>
      {finalValTitle && <Tooltip disableFocusListener disableTouchListener title={finalValTitle} {...tooltipProps}>
        <span>
          <CellComponent {...errors} value={newValue} {...component} row={row} column={column} onClick={_onClick} onChange={_onChange} onAnalytics={onAnalytics} onAction={_onAction} onKeyPress={_onKeyPress} onBlur={_Blur} />
        </span>
      </Tooltip>}
      {!finalValTitle &&
        <CellComponent {...errors} value={newValue} {...component} row={row} column={column} onClick={_onClick} onChange={_onChange} onAnalytics={onAnalytics} onAction={_onAction} onKeyPress={_onKeyPress} onBlur={_Blur} />
      }
    </div>
  );
};

GridCell.propTypes = {
  errors: PropTypes.object,
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

export default GridCell;
