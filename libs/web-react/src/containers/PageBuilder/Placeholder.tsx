import React from 'react';
import { useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import { ItemTypes } from './ItemTypes';
import { storage } from '../../utils';

function selectBackgroundColor(isActive, canDrop) {
  if (isActive) {
    return 'sq-placeholder-drop--active';
  } else if (canDrop) {
    return 'sq-placeholder-drop--can-drop';
  } else {
    return 'sq-placeholder-drop--default';
  }
}
const Placeholder = ({
  component,
  name,
  allowedDropEffect,
  onDrop,
  accept,
  plaecHolderStyle = 'box',
  hoverText,
}: any) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: accept || ItemTypes.COMPONENT,
      drop: (item, params) => {
        onDrop && onDrop(item, params);
        return {
          name: `${allowedDropEffect}placeholder`,
          allowedDropEffect,
        };
      },
      collect: (monitor) => {
        return { isOver: monitor.isOver(), canDrop: monitor.canDrop() };
      },
    }),
    [allowedDropEffect]
  );
  const isActive = canDrop && isOver;
  const { Icon } = storage.components.get();
  const backgroundCSS = selectBackgroundColor(isActive, canDrop);
  const finalName = component && name ? `for ${component}#${name}` : 'for root';
  return (
    <div
      className={`sq-placeholder-drop ${backgroundCSS} sq-placeholder-drop-style-${plaecHolderStyle}`}
      style={{}}
    >
      <div className="sq-placeholder-drop__dropper" ref={drop} style={{}}></div>

      <div className="sq-placeholder-drop__hover-text">
        {plaecHolderStyle === 'line' ? hoverText : ''}
      </div>
      <div className="sq-placeholder-drop__content">
        <Icon name="Move" variant={'extra1'} />
        <br />
        {isActive
          ? `Release to drop ${finalName}`
          : `Drag component here ${finalName}`}
      </div>
    </div>
  );
};

Placeholder.propTypes = {
  component: PropTypes.string,
  name: PropTypes.string,
  allowedDropEffect: PropTypes.string,
  onDrop: PropTypes.func,
  accept: PropTypes.array,
  plaecHolderStyle: PropTypes.string,
  hoverText: PropTypes.string,
};
export { Placeholder };
