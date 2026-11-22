import PropTypes from 'prop-types';
import ReactHtmlParser from 'html-react-parser';
import { utils, cordova } from '@qubejs/web-react';
const { common, object, validator, storage } = utils;
const { resolveImageUrl } = cordova;

const TemplateWithBackground = ({
  background,
  eyebrow,
  header,
  headerTag = 'h1',
  className = '',
  bodyTag = 'p',
  subHeader,
  theme = 'default',
  links = [],
  links2 = [],
  onAnalytics,
  classes = {},
  userData,
}: any) => {
  const HTag = headerTag;
  const BTag = bodyTag;
  const componentMap = storage.components.get();
  const styles: any = {};
  if (background) {
    styles.backgroundImage = `url(${resolveImageUrl(background)})`;
  }
  return (
    <div
      className={`sq-hero-content--large-background ${className} sq-hero-content--large-background-theme-${theme}`}
    >
      <div
        className={`sq-hero-content__root ${common.toStringBlank(
          classes.root
        )}`}
        style={styles}
      >
        <div
          className={`sq-hero-content__wrapper ${common.toStringBlank(
            classes.wrapper
          )}`}
        >
          <div
            className={`sq-hero-content__inner-wrapper ${common.toStringBlank(
              classes.innerWrapper
            )}`}
          >
            <div
              className={`sq-hero-content__body ${common.toStringBlank(
                classes.body
              )}`}
            >
              {eyebrow && (
                <div
                  className={`sq-hero-content__eyebrow ${common.toStringBlank(
                    classes.eyebrow
                  )}`}
                >
                  {ReactHtmlParser(object.processMessage(eyebrow, userData))}
                </div>
              )}
              {header && (
                <HTag
                  className={`sq-hero-content__header ${common.toStringBlank(
                    classes.header
                  )}`}
                >
                  {ReactHtmlParser(object.processMessage(header, userData))}
                </HTag>
              )}
              {subHeader && (
                <BTag
                  className={`sq-hero-content__sub-header ${common.toStringBlank(
                    classes.subHeader
                  )}`}
                >
                  {ReactHtmlParser(object.processMessage(subHeader, userData))}
                </BTag>
              )}
              {links && (
                <div
                  className={`sq-hero-content__links-container ${common.toStringBlank(
                    classes.links
                  )}`}
                >
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
              {links2 && (
                <div
                  className={`sq-hero-content__links2-container ${common.toStringBlank(
                    classes.links2
                  )}`}
                >
                  {links2.map((link, idx) => {
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
