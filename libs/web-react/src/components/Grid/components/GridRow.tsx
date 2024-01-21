import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GridCell from './GridCell';
import { object } from '../../../utils';

const Row = ({ columns = [], isGrouper, dynamicWidth, spacer = false, data = {}, onMouseOver, onMouseOut, onRowClick, onRowChange, onFieldBlur, onFieldClick, onFieldAction, onColumnChange, onChildRowRender, onAnalytics, className, wrapperClassName, errors = {} }) => {
  const _onChange = (column, value) => {
    onColumnChange && onColumnChange(column, value, data);
    onRowChange &&
      onRowChange(
        column,
        {
          [column.name]: value.value,
        },
        data
      );
  };
  const _onRowClick = () => {
    onRowClick && onRowClick(columns, data);
  };
  const _onBlur = (column, value) => {
    onFieldBlur && onFieldBlur(column, value, data);
  };

  const _onClick = (column, value) => {
    onFieldClick && onFieldClick(column, value, data);
  };
  const _onAction = (column, action) => {
    onFieldAction && onFieldAction(column, action, data);
  };
  const childRow = onChildRowRender && onChildRowRender(columns, data);

  return (
    <>
      <div className={`sq-grid__row-wrapper ${wrapperClassName}`} role="row" onMouseOver={onMouseOver} onMouseOut={onMouseOver}>
        <div className={`sq-grid__row sq-grid__data-row ${isGrouper ? 'sq-grid__data-group-row' : ''} ${className}`} onClick={_onRowClick}>
          {columns.map((column, index) => {
            let isRender = true;
            if (typeof column.beforeRender === 'function') {
              isRender = column.beforeRender(column, data[column.name], data);
            }
            const value = object.getDataFromKey(data, column.name, undefined);
            return (
              isRender && (
                <GridCell
                  key={index}
                  column={column}
                  style={dynamicWidth && dynamicWidth[column.name]}
                  {...column}
                  row={data}
                  errors={errors[column.name]}
                  onChange={(column, value) => {
                    _onChange(column, value);
                  }}
                  onClick={(column, value) => {
                    _onClick(column, value);
                  }}
                  onAction={(column, action) => {
                    _onAction(column, action);
                  }}
                  onAnalytics={onAnalytics}
                  onBlur={_onBlur}
                  value={value}
                />
              )
            );
          })}
          {spacer && <div className="sq-grid__data-cell sq-grid__data-cell--spacer" />}
        </div>
        {childRow && (
          <div className="sq-grid__row-child-wrapper">
            <div className={`sq-grid__child-row`}>{childRow}</div>
          </div>
        )}
      </div>
    </>
  );
};

Row.propTypes = {
  columns: PropTypes.array,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  data: PropTypes.object,
  errors: PropTypes.object,
  onRowChange: PropTypes.func,
  onFieldClick: PropTypes.func,
  onFieldAction: PropTypes.func,
  onColumnChange: PropTypes.func,
  onFieldBlur: PropTypes.func,
};

export default Row;
