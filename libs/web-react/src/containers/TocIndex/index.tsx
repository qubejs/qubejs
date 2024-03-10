import PropTypes from 'prop-types';
import { Component } from 'react';
import { components } from '../../utils/storage';
import './_toc-index.scss';

class TableOfContent extends Component {
  props: any;
  state: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {};
  }

  extractCatName(name) {
    if (name.indexOf('::') > -1) {
      return name.substr(name.indexOf('::') + 2);
    }
    return name;
  }

  render() {
    const { metaData = {}, pageData = {}, ...rest } = this.props;
    const { className = '' } = pageData;
    const { Header, LinkButton } = components.get();
    const categories = Object.keys(metaData.siblingPages || {});
    return (
      <div className={`sq-content-toc sq-content-page__body ${className}`}>
        <div className="container-fluid">
          <Header header={pageData.title} className="text-center" />
          <div className="sq-content-toc__container">
            {categories &&
              categories.map((cat, idx) => {
                const category = metaData.siblingPages[cat];
                return (
                  <div key={idx} className="sq-content-toc__item">
                    <h4 className="sq-content-toc__header ">
                      {this.extractCatName(cat)}{' '}
                    </h4>
                    {category.map((data, cIdx) => {
                      return (
                        <div key={cIdx}>
                          <LinkButton to={data.path} buttonText={data.title} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

TableOfContent.propTypes = {
  commonStore: PropTypes.object,
  contentStore: PropTypes.object,
};

export default TableOfContent;
