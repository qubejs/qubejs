import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon";
import "./_image-with-spotlight.scss";

const ImageWithSpotlight = ({
  bgImageUrl = "",
  overlay = true,
  header = "",
  className = "",
  actions = [],
  onAction,
}:any) => {
  return (
    <div className={`sq-image-with-spotlight ${className}`}>
      <div className="sq-image-with-spotlight__container">
        <div
          className="sq-image-with-spotlight__bg"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        >
          {overlay && <div className="sq-image-with-spotlight__overlay"></div>}
        </div>
        <div className="sq-image-with-spotlight__header">
          <h1 className="sq-image-with-spotlight__header-text">{header}</h1>
        </div>
      </div>
      <div className="sq-image-with-spotlight__actions-container">
        {actions.map((action) => {
          return (
            <div
              className={`sq-image-with-spotlight__action ${action.color}`}
              onClick={(event) => onAction && onAction(event, action)}
            >
              <div className="sq-image-with-spotlight__action-icon">
                <Icon name={action.iconName} size="auto" variant="normal" />
              </div>
              <div className="sq-image-with-spotlight__action-text">
                {action.buttonText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ImageWithSpotlight.propTypes = {
  bgImageUrl: PropTypes.string,
  overlay: PropTypes.bool,
  header: PropTypes.string,
  className: PropTypes.string,
  actions: PropTypes.array,
  onAction: PropTypes.func,
};

export default ImageWithSpotlight;
