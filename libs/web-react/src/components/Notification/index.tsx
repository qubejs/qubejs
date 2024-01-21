import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';


const ANIMATION_TIMEOUT = 1000;

class Notfication extends React.Component {
  props:any;
  prevInterval: any;
  state: any;
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
    this.prevInterval = null;
  }

  componentWillReceiveProps(props) {
    
    if (props.message) {
      if (this.prevInterval) {
        clearTimeout(this.prevInterval);
        this.prevInterval = null;
      }
      this.setState({
        message: props.message,
        active: true
      });

    } else if (props.message !== undefined) {
      this.setState({
        active: false
      });
      this.prevInterval = setTimeout(() => {
        this.setState({
          message: ''
        });
      }, ANIMATION_TIMEOUT);
    }
  }

  render() {
    const { type = 'info', position = '', icon = true }:any = this.props;
    return <div className={`sq-alert-notification alert alert-${type} ${!icon ? 'sq-alert-notification--no-icon' : ''} ${position ? 'sq-alert-notification--' + position : ''} ${this.state.active ? 'sq-alert-notification--active' : ''}`} role="alert">
      <span className="sq-alert-notification__text">
        {this.state.message && icon &&<Icon name={type} className="sq-alert-notification__icon" />}
        {this.state.message}
      </span>
    </div>;
  }
}

Notfication.propTypes = {
  type: PropTypes.string,
  icon: PropTypes.bool,
  position: PropTypes.string,
  message: PropTypes.string
};

export default Notfication;