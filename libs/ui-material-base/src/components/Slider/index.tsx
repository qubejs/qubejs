import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

class SQSlider extends React.Component {
  props: any;
  state: any;
  static propTypes: any;
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
    const { min = 0, format, max = 100, marks = [], className = '', label = '', value, step, valueLabelDisplay = 'off' } = this.props;
    return (
      <div className={`sq-slider ${className}`}>
        <label className="sq-slider__label">{label}</label>
        <Typography id="discrete-slider-always" gutterBottom>
          {(format && format(this.state.value)) || this.state.value}
        </Typography>
        <Slider
          defaultValue={value}
          value={this.state.value}
          onChange={this.handleChange}
          aria-labelledby="discrete-slider-always"
          step={step}
          marks={marks}
          min={min}
          max={max}
          valueLabelDisplay={valueLabelDisplay}
        />
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
