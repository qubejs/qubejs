import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@mui/material';
import MagicHeroContent from '../../MagicHeroContent';

function FullBg({ data, ...rest }) {
  return (
    <Paper>
      <MagicHeroContent {...rest} {...data}  />
    </Paper>
  );
}

FullBg.propTypes = {
  data: PropTypes.object
};

export default FullBg;
