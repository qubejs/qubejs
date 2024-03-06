import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Icon from '../Icon';

class LabelBottomNavigation extends React.Component {
  props:any;
  state:any;
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      value: this.props.value,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }
  handleChange(evt, newValue) {
    const { onChange, links = [], onAnalytics } = this.props;
    const item = filter(links, { value: newValue });
    const { analytics = {} } = item.length ? item[0] : {};
    const { click } = analytics;
    this.setState({
      value: newValue,
    });
    onChange && onChange(newValue, item[0]);
    onAnalytics && click && onAnalytics(click);
  }

  render() {
    const { links = [], showLabels = false, iconOnly = false } = this.props;
    return (
      <div className="sq-bottom-navigation">
        <BottomNavigation value={this.state.value} onChange={this.handleChange} className={`sq-bottom-navigation__nav`} showLabels={showLabels}>
          {links.map((link) => {
            return <BottomNavigationAction key={link.value} label={iconOnly ? '' : link.label} value={link.value} icon={<Icon name={link.icon} variant="normal" />} />;
          })}
        </BottomNavigation>
      </div>
    );
  }
}
LabelBottomNavigation.propTypes = {
  links: PropTypes.array,
  onChange: PropTypes.func,
  onAnalytics: PropTypes.func,
  value: PropTypes.string,
};

export default LabelBottomNavigation;
