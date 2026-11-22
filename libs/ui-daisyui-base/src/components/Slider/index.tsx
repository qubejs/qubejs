import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '../../daisy/ui/slider';

class SQSlider extends React.Component {
  props: any;
  state: any;
  static propTypes: any;
  labelId = `sq-slider-${Math.random().toString(36).slice(2, 10)}`;
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      value: this.props.value || 0
    });
  }

  handleChange(evt, newValue) {
    const { onChange } = this.props;
    onChange &&
      onChange({
        value: newValue
      });
    this.setState({
      value: newValue
    });
  }

  render() {
    const { min = 0, format, max = 100, marks = [], className = '', label = '', step } = this.props;
    return (
      <div className={`sq-slider ${className}`}>
        <label className="sq-slider__label">{label}</label>
        <div id={`${this.labelId}`} className="sq-slider__value mb-2 text-sm">
          {(format && format(this.state.value)) || this.state.value}
        </div>
        <Slider
          value={[this.state.value]}
          onValueChange={(values) => this.handleChange(undefined, values[0])}
          aria-labelledby={this.labelId}
          step={step || 1}
          min={min}
          max={max}
          className="sq-slider__control"
        />
        {Array.isArray(marks) && marks.length > 0 && (
          <div className="sq-slider__marks relative mt-2 h-4 text-xs text-muted-foreground">
            {marks.map((mark) => (
              <span
                key={mark.value}
                className="absolute -translate-x-1/2"
                style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
              >
                {mark.label ?? mark.value}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
}

SQSlider.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  format: PropTypes.func,
  value: PropTypes.any
};

export default SQSlider;
