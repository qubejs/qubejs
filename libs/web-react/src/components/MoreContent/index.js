import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Link from '../Link';


const MoreContent = ({ linkProps, popoverProps, title, content, ...rest }) => {
  const { analytics = {}, onAnalytics } = rest;
  const { click } = analytics;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    onAnalytics && click && onAnalytics(click);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <div className="sq-more-content">
      <Link {...linkProps} className={`sq-more-content__link`} onAnalytics={onAnalytics} onClick={handleClick} />
      <Popover
        open={open}
        className={`sq-more-content__popover`}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        {...popoverProps}
      >
        <Box p={2}>
          {title && <div>{ReactHtmlParser(title)}</div>}
          {ReactHtmlParser(content)}
          </Box>
      </Popover>
    </div>
  );
};
MoreContent.propTypes = {
  linkProps: PropTypes.object,
  className: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func
};

export default MoreContent;
