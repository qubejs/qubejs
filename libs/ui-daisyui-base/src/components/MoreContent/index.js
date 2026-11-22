import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Popover, PopoverAnchor, PopoverContent } from '../../daisy/ui/popover';
import Link from '../Link';

const MoreContent = ({ linkProps, popoverProps = {}, title, content, ...rest }) => {
  const { analytics = {}, onAnalytics } = rest;
  const { click } = analytics;
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
    onAnalytics && click && onAnalytics(click);
  };
  return (
    <div className="sq-more-content">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <span className="inline-block">
            <Link {...linkProps} className={`sq-more-content__link`} onAnalytics={onAnalytics} onClick={handleClick} />
          </span>
        </PopoverAnchor>
        <PopoverContent side="top" className={`sq-more-content__popover ${popoverProps.className || ''}`}>
          {title && <div className="mb-1 font-medium">{ReactHtmlParser(title)}</div>}
          {ReactHtmlParser(content)}
        </PopoverContent>
      </Popover>
    </div>
  );
};
MoreContent.propTypes = {
  linkProps: PropTypes.object,
  className: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
};

export default MoreContent;
