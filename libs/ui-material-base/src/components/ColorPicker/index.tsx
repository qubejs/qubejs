import { useState } from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ label, onChange, defaultColor = "#FFF" } :any) => {
  const [openPickerPopup, setOpenPickerPopup] = useState(false);
  const [color, setColor] = useState(defaultColor);

  const handleChange = (color) => {
    setColor(color.hex);
  };
  const handleChangeComplete = (finalColor) => {
    onChange && onChange({ value: finalColor.hex });
  };

  return (
    <div className="sq-color-picker">
      <div className="sq-color-picker__label">
        {label}:
        <button type="button" className="sq-color-picker__value" onClick={() => setOpenPickerPopup(!openPickerPopup)}>
          <span className="sq-color-picker__color" style={{ backgroundColor: color }} />
        </button>
      </div>
      {openPickerPopup ? (
        <div className="sq-color-picker__popover">
          <div className="sq-color-picker__cover" onClick={() => setOpenPickerPopup(false)} />
          <SketchPicker
            className="sq-color-picker__picker"
            color={color}
            onChange={handleChange}
            presetColors={[]}
            disableAlpha
            onChangeComplete={handleChangeComplete}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
