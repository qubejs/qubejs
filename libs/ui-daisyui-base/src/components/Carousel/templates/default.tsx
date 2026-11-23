import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../../daisy/ui/card';

import { cordova } from '@qubejs/web-react';

function Default({ data }) {
  return (
    <Card className="sq-carousel__paper gap-0 overflow-hidden py-0">
      <div className="sq-carousel__image">
        <img src={cordova.resolveImageUrl(data.imgUrl)} />
      </div>
      <div className="sq-carousel__content">
        <h2 className="sq-carousel__header">{data.name}</h2>
        <div className="sq-carousel__sub-header">{data.description}</div>
      </div>
    </Card>
  );
}

Default.propTypes = {
  data: PropTypes.object,
};

export default Default;
