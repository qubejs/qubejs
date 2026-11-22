import React from 'react';
import PropTypes from 'prop-types';
import Select from '../Select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../daisy/ui/pagination';
import { cn } from '../../daisy/lib/utils';

/** Page numbers to show: first, last, current +/- 1, with 'ellipsis' gaps (like MUI). */
export const getPageItems = (count: number, page: number, siblings = 1) => {
  const items: Array<number | 'ellipsis'> = [];
  if (!count || count < 1) return items;
  const start = Math.max(2, page - siblings);
  const end = Math.min(count - 1, page + siblings);
  items.push(1);
  if (start > 2) items.push('ellipsis');
  for (let i = start; i <= end; i++) items.push(i);
  if (end < count - 1) items.push('ellipsis');
  if (count > 1) items.push(count);
  return items;
};

function SQPagination({
  size,
  className = '',
  disabled = false,
  defaultPage = 1,
  count,
  onChange,
  value = {},
  color = 'primary',
  pageSize = 25,
  pageSizeLabel = 'Page size',
  pageSizeOptions = [],
  enablePageSize = false,
}: any) {
  const currentPage = value.currentPage || defaultPage;
  const handleChange = (event, inputValue) => {
    event && event.preventDefault && event.preventDefault();
    if (disabled || inputValue < 1 || inputValue > count) return;
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
            currentPage: 1,
          },
        });
    }
  };
  const linkSize = size === 'small' ? 'icon-sm' : size === 'large' ? 'icon-lg' : 'icon';
  return (
    <div className={`sq-pagination ${className}`}>
      {enablePageSize && (
        <Select
          size={size}
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
      <Pagination
        className={cn('sq-pagination__pages mx-0 w-auto justify-start', `sq-pagination--${color}`, disabled && 'pointer-events-none opacity-50')}
        aria-disabled={disabled || undefined}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text=""
              aria-disabled={currentPage <= 1 || undefined}
              className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
              onClick={(e) => handleChange(e, currentPage - 1)}
            />
          </PaginationItem>
          {getPageItems(count, currentPage).map((item, idx) => (
            <PaginationItem key={`${item}_${idx}`}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  size={linkSize as any}
                  isActive={item === currentPage}
                  aria-label={`Go to page ${item}`}
                  onClick={(e) => handleChange(e, item)}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              text=""
              aria-disabled={currentPage >= count || undefined}
              className={cn(currentPage >= count && 'pointer-events-none opacity-50')}
              onClick={(e) => handleChange(e, currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

SQPagination.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  value: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default SQPagination;
