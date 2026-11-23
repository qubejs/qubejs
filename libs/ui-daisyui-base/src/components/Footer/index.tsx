import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Form from '../Form';
import LinkButton from '../LinkButton';
import { utils, cordova, globals } from '@qubejs/web-react';
const { Validator } = utils.validator;
const { redirectTo } = utils.redirect;
const { resolveImageUrl, isApp } = cordova;
const apiBridge = utils.apiBridge;
const { CONSTANTS } = globals;

class Footer extends Component {
  validator:any;
  state:any;
  props:any;
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = {};
    this.validator = new Validator({
      email: {
        validators: [{ type: 'required' }, { type: 'email' }]
      }
    });
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnAction = this.handleOnAction.bind(this);
  }

  renderSubNav(item, callback?) {
    return (
      item.children &&
      item.children.length > 0 && (
        <>
          <ul className="sq-footer__nav-sub-list">
            {item.children.map((child, idx) => {
              return (
                <li
                  key={idx}
                  className="sq-footer__nav-sub-item"
                  onClick={(e:any) => {
                    if (e.target.tagName === 'LI') {
                      e.preventDefault();
                    }
                  }}
                >
                  <a
                    href={child.href}
                    onClick={(e:any) => {
                      if (e.defaultPrevented) return; // Exits here if event has been handled
                      e.preventDefault();
                      redirectTo(child.href, { ...child.params });
                      callback && callback();
                    }}
                    className="sq-footer__nav-sub-item-link"
                  >
                    {child.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )
    );
  }

  async handleOnAction(data, action) {
    const { newsletter } = this.props;
    const { type = 'POST' } = newsletter.api;
    this.validator.setValues(data);
    const isValid = this.validator.validateAll();
    this.setState({
      isValid,
      newsErrors: this.validator.errors
    });
    if (isValid && action.actionType === 'newsletter') {
      const response = await apiBridge[type.toLowerCase()](newsletter.api.url, { email: data.email });
      if (response.status === CONSTANTS.STATUS.SUCCESS) {
        this.setState({
          newsLetterResponse: 'success'
        });
      }
    }
  }

  handleOnChange(data) {
    this.validator.setValues({
      email: data.value
    });
    const isValid = this.validator.validateAll();

    this.setState({
      isValid,
      newsErrors: this.validator.errors
    });
  }
  render() {
    const { items, items2, classes = {}, className, logo = {}, copyrights, socialLinks, newsletter, appDetails, contactus, onAnalytics } = this.props;
    return (
      <nav className={`sq-footer ${className}`}>
        <div className="sq-footer__wrapper">
          <div className="sq-footer__logo text-muted">
            {logo.svg && logo.svg}
            {!logo.svg && logo.name && <Icon {...logo} variant="default" />}
            {logo.img && <img src={`${resolveImageUrl(logo.img)}`} alt={logo.imgAlt} />}
            {logo.text}
          </div>
          <div className="container-fluid sq-footer__content">
            <div className="row">
              <div className="col-xs-12 col-md-9 sq-footer__content-section">
                <div className="sq-footer__links">
                  <nav className={`sq-footer__nav ${classes.itemWrapper}`}>
                    {items &&
                      items.map((linkItem, idx) => {
                        return (
                          <div key={idx} className={`sq-footer__nav-item ${classes.item}`}>
                            <a
                              className="sq-footer__nav-item-link"
                              href={linkItem.href}
                              onClick={(e) => {
                                if (e.defaultPrevented) return; // Exits here if event has been handled
                                e.preventDefault();
                                redirectTo(linkItem.href);
                              }}
                            >
                              <span className="sq-footer__nav-item-text">{linkItem.title}</span>
                            </a>
                            {this.renderSubNav(linkItem)}
                          </div>
                        );
                      })}
                    {items2 &&
                      items2.map((linkItem, idx) => {
                        return (
                          <div key={idx} className={`sq-footer__nav-item ${classes.item}`}>
                            {linkItem.href && (
                              <a
                                className="sq-footer__nav-item-link"
                                href={linkItem.href}
                                onClick={(e) => {
                                  if (e.defaultPrevented) return; // Exits here if event has been handled
                                  e.preventDefault();
                                  redirectTo(linkItem.href);
                                }}
                              >
                                <span className="sq-footer__nav-item-text">{linkItem.title}</span>
                              </a>
                            )}
                            {!linkItem.href && (
                              <span className="sq-footer__nav-item-link">
                                <span className="sq-footer__nav-item-text">{linkItem.title}</span>
                              </span>
                            )}
                            {this.renderSubNav(linkItem)}
                          </div>
                        );
                      })}
                  </nav>
                </div>
              </div>
              <div className="col-xs-12 col-md-3 sq-footer__content-section">
                {contactus && (
                  <div className="sq-footer__contactus">
                    <ul className="list-none">
                      <li className="sq-footer__nav-item-link">
                        <span>{contactus.header}</span>
                      </li>
                      {contactus.info &&
                        contactus.info.map((item, idx) => (
                          <li key={idx}>
                            <LinkButton {...item} onAnalytics={onAnalytics} />
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                {!isApp() && appDetails && (
                  <div className="sq-footer__app-details">
                    <div className="sq-footer__app-details-header">{appDetails.title}</div>
                    <div className="sq-footer__app-details-container">
                      {appDetails.appStore && (
                        <div className="sq-footer__app-details-app">
                          <a target="_blank" href={`${appDetails.appStore.href}`}>
                            <img src={`${resolveImageUrl(appDetails.appStore.img)}`} alt="App store" />
                          </a>
                        </div>
                      )}
                      {appDetails.playStore && (
                        <div className="sq-footer__app-details-app">
                          <a target="_blank" href={`${appDetails.playStore.href}`}>
                            <img src={`${resolveImageUrl(appDetails.playStore.img)}`} alt="Google Play store" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {newsletter && (
                  <div className="sq-footer__newsletter">
                    <h4>{newsletter.header}</h4>
                    {!this.state.newsLetterResponse && (
                      <Form
                        fields={[
                          {
                            type: 'Input',
                            name: 'email',
                            label: newsletter.label || 'Email'
                          }
                        ]}
                        onAction={this.handleOnAction}
                        errors={this.state.newsErrors}
                        onFieldKeyPress={this.handleOnChange}
                        onAnalytics={onAnalytics}
                        actions={[
                          {
                            type: 'Button',
                            actionType: 'newsletter',
                            buttonText: newsletter.buttonText || 'Subscribe',
                            color: 'flat-primary'
                          }
                        ]}
                      />
                    )}
                    {this.state.newsLetterResponse && <div>{newsletter.successMessage}</div>}
                  </div>
                )}
                
              </div>
            </div>
            {socialLinks && (
              <div className="row">
                <div className={`col text-center ${socialLinks.className || ''}`}>
                  <h4>{socialLinks.header}</h4>
                  <div className="sq-footer__social-links">
                    {socialLinks.links &&
                      socialLinks.links.map((link, idx) => {
                        return <LinkButton key={idx} target="_blank" size="large" {...link} onAnalytics={onAnalytics} />;
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sq-footer__copyrights">{copyrights}</div>
      </nav>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
  copyrights: PropTypes.string,
  logo: PropTypes.object,
  onAnalytics: PropTypes.func,
  items: PropTypes.array
};

export default Footer;
