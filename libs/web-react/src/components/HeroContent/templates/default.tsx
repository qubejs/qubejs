import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'html-react-parser';
import ImageOnDevice from '../../ImageOnDevice';
import { common, object, validator, storage } from '../../../utils';
import { resolveImageUrl } from '../../../cordova';

const compMap = {
  ImageOnDevice,
};

const HeroTemplateDefault = ({
  name = '',
  className = '',
  image = {},
  eyebrow,
  header,
  headerTag = 'h1',
  bodyTag = 'p',
  subHeader,
  links,
  links2,
  imageUrl,
  classes = {},
  onAnalytics,
  userData,
}:any) => {
  const HTag = headerTag;
  const BTag = bodyTag;
  const componentMap = storage.components.get();
  const { cmpType: imageCmpType, imageUrl: imageNewUrl, images, ...restImage }:any = image;
  let RenderImage;
  if (imageCmpType && compMap[imageCmpType]) {
    RenderImage = compMap[imageCmpType];
    imageUrl = imageNewUrl;
  }
  return (
    <div className={`sq-hero-content--default ${name} ${className}`}>
      <div className={`sq-hero-content__root ${common.toStringBlank(classes.root)}`}>
        <div className="sq-hero-content__wrapper">
          <div className="sq-hero-content__content-col">
            {eyebrow && <div className={`sq-hero-content__eyebrow ${common.toStringBlank(classes.eyebrow)}`}>{ReactHtmlParser(object.processMessage(eyebrow, userData))}</div>}
            {header && <HTag className={`sq-hero-content__header ${common.toStringBlank(classes.header)}`}>{ReactHtmlParser(object.processMessage(header, userData))}</HTag>}
            {subHeader && (
              <BTag className={`sq-hero-content__sub-header ${common.toStringBlank(classes.subHeader)}`}>{ReactHtmlParser(object.processMessage(subHeader, userData))}</BTag>
            )}
            {links && (
              <div className={`sq-hero-content__links-container ${common.toStringBlank(classes.links)}`}>
                {links.map((link, idx) => {
                  const CompRender = componentMap[link.cmpType] || componentMap.LinkButton;
                  let isValid = true;
                  if (link.match) {
                    const validr = new validator.Validator(link.match);
                    validr.setValues(userData);
                    isValid = validr.validateAll();
                  }
                  return isValid ? (
                    <CompRender
                      className={`sq-hero-content__link ${common.toStringBlank(classes.link)}`}
                      onAnalytics={onAnalytics}
                      key={idx}
                      {...link}
                    />
                  ) : (
                    <></>
                  );
                })}
              </div>
            )}
            {links2 && (
              <div className={`sq-hero-content__links2-container ${common.toStringBlank(classes.links2)}`}>
                {links2.map((link, idx) => {
                  const CompRender = componentMap[link.cmpType] || componentMap.LinkButton;
                  let isValid = true;
                  if (link.match) {
                    const validr = new validator.Validator(link.match);
                    validr.setValues(userData);
                    isValid = validr.validateAll();
                  }
                  return isValid ? (
                    <CompRender
                      className={`sq-hero-content__link ${common.toStringBlank(classes.link)}`}
                      onAnalytics={onAnalytics}
                      key={idx}
                      {...link}
                    />
                  ): <></>;
                })}
              </div>
            )}
          </div>
          {(imageUrl || images) && (
            <div className={`sq-hero-content__content-image ${common.toStringBlank(classes.image)}`}>
              <div className="sq-hero-content__image">
                {RenderImage && (
                  <RenderImage
                    src={imageUrl}
                    images={images}
                    {...restImage}
                  />
                )}
                {!RenderImage && <img src={resolveImageUrl(imageUrl)} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

HeroTemplateDefault.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string,
  subHeader: PropTypes.string,
};

export default HeroTemplateDefault;
