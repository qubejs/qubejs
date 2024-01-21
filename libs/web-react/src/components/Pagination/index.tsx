import React from 'react';
import PropTypes from 'prop-types';
import Select from '../Select';
import Pagination from '@mui/material/Pagination';

function SQPagination({ className = '', disabled = false, defaultPage, count, onChange, value = {}, color = 'primary', pageSize = 25, pageSizeLabel = 'Page size', pageSizeOptions = [], enablePageSize = false }:any) {
  const handleChange = (event, inputValue) => {
    if (value.currentPage !== inputValue) {
      onChange &&
        onChange({
          value: {
            pageSize,
            ...value,
            currentPage: inputValue,
          },
        });
    }
  };
  const handlePageSizeChange = (inputValue) => {
    if (value.pageSize !== inputValue) {
      onChange &&
        onChange({
          value: {
            ...value,
            pageSize: inputValue,
            currentPage: 1
          },
        });
    }
  };
  return (
    <div className={`sq-pagination ${className}`}>
      {enablePageSize && (
        <Select
          className="sq-pagination__page-size"
          label={pageSizeLabel}
          value={String(value.pageSize || pageSize)}
          disabled={disabled}
          options={pageSizeOptions}
          onChange={({ value }) => {
            handlePageSizeChange(value);
          }}
        />
      )}
      <Pagination disabled={disabled} count={count} page={value.currentPage} defaultPage={defaultPage} color={color} onChange={handleChange} />
    </div>
  );
}

SQPagination.propTypes = {
  className: PropTypes.string,
  value: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default SQPagination;
