import React, { Component } from 'react';
import Content from '../Content';

class LayoutContent extends Component {
  props:any;
  state:any;
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { metaData = {}, pageData = {} } = this.props;
    eval(pageData.javascript);
  }

  render() {
    const { metaData = {}, pageData = {}, ...rest } = this.props;
    const { className = '', rows = [] } = pageData;
    return (
      <div className={`sq-layout-content sq-content-page__body ${className}`}>
        <div className="container-fluid">
          {rows.map((rowObj, idx) => {
            const { pageLayout = {}, className = 'row' } = rowObj;
            return (
              <div key={idx} className={`${className}`}>
                {Object.keys(pageLayout).map((layoutKey) => {
                  const layoutObj = pageLayout[layoutKey];
                  const { className = '', ...restLayout } = layoutObj;
                  return (
                    <div key={layoutKey} className={`sq-layout-content__block ${layoutKey} ${className}`}>
                      <Content flat={true} {...rest} pageData={{ ...restLayout }} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

LayoutContent.propTypes = {};

export default LayoutContent;
