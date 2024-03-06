import { useDrag } from 'react-dnd';
import groupBy from 'lodash/groupBy';
import PropTypes from 'prop-types';
import { ItemTypes } from './ItemTypes';

const Component = ({ type, name, displayText, metaData, onSuccess }: any) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: type || ItemTypes.COMPONENT,
      item: { name, metaData },
      end(item, monitor) {
        const dropResult: any = monitor.getDropResult();
        if (item && dropResult) {
          const isDropAllowed =
            dropResult.allowedDropEffect === 'any' ||
            dropResult.allowedDropEffect === dropResult.dropEffect;
          if (isDropAllowed) {
            onSuccess && onSuccess(item, dropResult);
          }
        }
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 'dragged' : 'default',
      }),
    }),
    [name]
  );
  return (
    <div
      className={`sq-component-list__item sq-component-list__item--${opacity}`}
      ref={drag}
    >
      {displayText}
    </div>
  );
};

const ComponentList = ({ onDrop, compList = {}, filter }: any) => {
  const grouped = groupBy(
    Object.keys(compList)
      .map((key) => {
        return {
          name: key,
          displayText: key,
          ...compList[key],
        };
      })
      .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
      .filter((item) => {
        if (filter) {
          return filter.indexOf(item.group) > -1;
        }
        return true;
      }),
    'group'
  );
  return (
    <div className="sq-component-list">
      {Object.keys(grouped)
        .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
        .map((group, idx) => {
          return (
            <div className="sq-component-list__group-wrapper" key={group}>
              <div className="sq-component-list__group">{group}</div>
              {grouped[group].map((comp, idx) => {
                return (
                  <Component
                    type={comp.type}
                    key={idx}
                    name={comp.name}
                    displayText={comp.displayText}
                    metaData={comp}
                    onSuccess={(item) => {
                      onDrop && onDrop(item);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

ComponentList.propTypes = {
  onDrop: PropTypes.func,
  compList: PropTypes.array,
  filter: PropTypes.array,
};

Component.propTypes = {
  type: PropTypes.string,
  displayText: PropTypes.string,
  name: PropTypes.string,
  metaData: PropTypes.object,
  onSuccess: PropTypes.func,
};
export { Component, ComponentList };
