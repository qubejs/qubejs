import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading';
const Pencil = React.lazy(() => import('./pencil-effect'));

const templates = {
  pencil: Pencil,
};

const MagicHeroContent = ({ name, items, template, ...rest }:any) => {
  const TemplateToRender = templates[template] || templates.pencil;
  return (
    <div className={`sq-magic-hero-content`}>
      <React.Suspense fallback={<Loading />}>
        <TemplateToRender
          name={name}
          {...{
            items,
          }}
          {...rest}
        />
      </React.Suspense>
    </div>
  );
};

MagicHeroContent.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
};

export default MagicHeroContent;
