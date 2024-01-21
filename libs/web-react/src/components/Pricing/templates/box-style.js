import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'html-react-parser';
import Icon from '../../Icon';
import { storage } from '../../../utils';

const renderPricingPlan = (data, onAnalytics) => {
  const { LinkButton } = storage.components.get();
  return (
    <div className={`sq-pricing__plan row fl-d-column ${data.color}`}>
      <div className="sq-pricing__icon">{<Icon name={data.icon} color={data.iconVarant} variant="bg-big" />}</div>
      <h2 className="sq-pricing__plan-header">{data.header}</h2>
      <h1 className="sq-pricing__plan-price">{data.price}</h1>
      <div className="sq-pricing__plan-last-price">{data.lastPrice}</div>
      <ul className="sq-pricing__featues-list">
        {data.features &&
          data.features.map((dataItem, idx) => {
            return (
              <>
                <div key={idx} className={`sq-pricing__feature-item ${dataItem.className}`}>
                  <Icon name={dataItem.icon} size="small" variant={dataItem.iconColor || 'none'} />
                  <span className="sq-pricing__feature-item-text">{dataItem.text}</span>
                </div>
              </>
            );
          })}
      </ul>
      <div className="sq-pricing__actions">
        {data.actions &&
          data.actions.map((dataItem, idx) => {
            return (
              <>
                <LinkButton key={idx} size='large'  {...dataItem} color="inherit" onAnalytics={onAnalytics} />
              </>
            );
          })}
      </div>
    </div>
  );
};

const TemplateDefault = ({ eyebrow, icon, header, headerTag = 'h1', bodyTag = 'p', features, subHeader, items, onAnalytics }) => {
  const HTag = headerTag;
  const BTag = bodyTag;

  return (
    <div className="sq-pricing--box-style">
      <div className="sq-pricing__wrapper">
        {items && (
          <div className="container-fluid sq-pricing__links-container">
            <div className="row">
              <div className="col sq-pricing__details">
                <div className="sq-pricing__details-info">
                  {icon && <Icon name={icon} />}
                  {eyebrow && <div className={`sq-pricing__eyebrow`}>{ReactHtmlParser(eyebrow)}</div>}
                  {header && <HTag className={`sq-pricing__header`}>{ReactHtmlParser(header)}</HTag>}
                  {subHeader && <BTag className={`sq-pricing__sub-header mb-wide`}>{ReactHtmlParser(subHeader)}</BTag>}
                </div>
                <div className="sq-pricing__details-features">
                  {features &&
                    features.map((dataItem, idx) => {
                      return (
                        <>
                          <div key={idx} className={`sq-pricing__details-features-item ${dataItem.className}`}>
                            <Icon name={dataItem.icon} size='small' variant={dataItem.iconColor || 'none'} />
                            <span className="sq-pricing__details-features-item-text">{dataItem.text}</span>
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
              {items.map((item, idx) => {
                return (
                  <div key={idx} className="col sq-pricing__details-item">
                    {renderPricingPlan(item, onAnalytics)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

TemplateDefault.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string,
  subHeader: PropTypes.string,
};

export default TemplateDefault;
