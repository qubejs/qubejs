import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../../daisy/ui/card';

import MagicHeroContent from '../../MagicHeroContent';

function FullBg({ data, ...rest }) {
  return (
    <Card className="sq-carousel__paper gap-0 overflow-hidden py-0">
      <MagicHeroContent {...rest} {...data}  />
    </Card>
  );
}

FullBg.propTypes = {
  data: PropTypes.object
};

export default FullBg;
