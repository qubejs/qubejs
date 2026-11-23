import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import { ToggleGroup, ToggleGroupItem } from '../../reui/ui/toggle-group';
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
        <ToggleGroup
          type="single"
          value={this.state.value ? `${this.state.value}` : ''}
          onValueChange={(key) => {
            // a single ToggleGroup emits '' when the active item is clicked again; keep it selected
            if (!key) return;
            const link = links.find((l) => `${l.value}` === key);
            this.handleChange(undefined, link ? link.value : key);
          }}
          className={`sq-bottom-navigation__nav flex w-full justify-around`}
        >
          {links.map((link) => {
            const selected = `${link.value}` === `${this.state.value}`;
            return (
              <ToggleGroupItem
                key={link.value}
                value={`${link.value}`}
                aria-label={link.label}
                className="h-auto flex-1 flex-col gap-0.5 py-1.5"
              >
                <Icon name={link.icon} variant="normal" />
                {!iconOnly && (showLabels || selected) && <span className="text-xs">{link.label}</span>}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
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
