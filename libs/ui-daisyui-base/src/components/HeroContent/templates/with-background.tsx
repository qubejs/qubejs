import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'html-react-parser';
import { utils, cordova } from '@qubejs/web-react';
const { object, validator, storage } = utils;
const { resolveImageUrl } = cordova;

const TemplateWithBackground = ({ background, eyebrow, header, headerTag = 'h1', bodyTag = 'p', subHeader, links = [], onAnalytics, classes = {}, userData }: any) => {
  const HTag = headerTag;
  const BTag = bodyTag;
  const componentMap = storage.components.get();
  return (
    <div
      className="sq-hero-content--with-background"
      style={{ backgroundImage: `url(${resolveImageUrl(background)})` }}
    >
      <div className={`sq-hero-content__root ${classes.root}`}>
        <div className="sq-hero-content__wrapper">
          {eyebrow && <div className={`sq-hero-content__eyebrow`}>{ReactHtmlParser(object.processMessage(eyebrow, userData))}</div>}
          {header && <HTag className={`sq-hero-content__header`}>{ReactHtmlParser(object.processMessage(header, userData))}</HTag>}
          {subHeader && <BTag className={`sq-hero-content__sub-header`}>{ReactHtmlParser(object.processMessage(subHeader, userData))}</BTag>}
          {links && (
            <div className="sq-hero-content__links-container">
              {links.map((link, idx) => {
                const CompRender = componentMap.LinkButton;
                let isValid = true;
                if (link.match) {
                  const validr = new validator.Validator(link.match);
                  validr.setValues(userData);
                  isValid = validr.validateAll();
                }
                return isValid ? (
                  <CompRender
                    onAnalytics={onAnalytics}
                    key={idx}
                    {...link}
                  />
                ) : undefined;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TemplateWithBackground.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string,
  subHeader: PropTypes.string,
};

export default TemplateWithBackground;
