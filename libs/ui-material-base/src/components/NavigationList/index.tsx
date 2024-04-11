import PropTypes from 'prop-types';
import LinkButton from '../LinkButton';
import { cordova } from '@qubejs/web-react';

const { getPathName } = cordova;

const extractCatName = (name) => {
  if (name.indexOf('::') > -1) {
    return name.substr(name.indexOf('::') + 2);
  }
  return name;
};

const NavigationList = ({ links = {}, className, headerTag = 'h4' }:any) => {
  const categories = Object.keys(links).sort((a, b) => (a > b ? 1 : -1));
  if (categories.indexOf('_root') > -1) {
    categories.splice(categories.indexOf('_root'), 1);
    categories.unshift('_root');
  }
  const currentPath = getPathName();
  const HeaderTag = headerTag;

  return (
    <div className={`sq-navigation-list ${className}`}>
      {categories &&
        categories.map((cat, idx) => {
          const category = links[cat];
          return (
            <div key={idx} className="sq-navigation-list__item">
              {!cat.startsWith('_') && <HeaderTag className="sq-navigation-list__header ">{extractCatName(cat)} </HeaderTag>}
              {category.map((data, cIdx) => {
                return (
                  <div key={cIdx} className={`sq-navigation-list__link ${data.path === currentPath ? 'sq-navigation-list__link--active' : ''}`}>
                    <LinkButton to={data.path} buttonText={extractCatName(data.title)} />
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

NavigationList.propTypes = {
  links: PropTypes.array,
  className: PropTypes.string
};

export default NavigationList;
