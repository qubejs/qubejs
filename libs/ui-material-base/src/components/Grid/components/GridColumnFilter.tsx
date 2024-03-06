import { useState, memo, useCallback, useRef } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import { useDrag, useDrop } from 'react-dnd';
import Checkbox from '../../Checkbox';
import Icon from '../../Icon';

const string = utils.string;

const ItemTypes = {
  CARD: 'CARD',
};

const style = {
  cursor: 'move',
};


const fixedStyles = {
  cursor: 'not-allowed',
};

const GridColumnFilter = ({ columns = [], value = [], colOrder, onChange, onColumReorder }) => {
  const [internalColumns, setInternalColumns] = useState([...columns].sort((a, b) => colOrder && (colOrder[a.name] > colOrder[b.name] ? 1 : colOrder[a.name] < colOrder[b.name] ? -1 : 0)));
  const hasAllSelection = columns.map((i) => (Array.isArray(value) && value.indexOf(i.name) > -1) || i.customize === false).filter((a) => a === false).length === 0;
  const handleSelectAll = (data) => {
    if (data.checked) {
      onChange &&
        onChange({
          value: internalColumns.map((i) => i.name),
        });
    } else {
      onChange &&
        onChange({
          value: internalColumns.filter((i) => i.customize === false).map((i) => i.name),
        });
    }
  };
  const handleChange = (data, col) => {
    if (data.checked) {
      const allCols = [...value, col.name];
      onChange &&
        onChange({
          value: internalColumns.filter((col) => col.customize === false || allCols.indexOf(col.name) > -1).map((i) => i.name),
        });
    } else {
      const copyVal = [...value];
      const idx = copyVal.indexOf(col.name);
      if (idx > -1) {
        copyVal.splice(idx, 1);
        onChange &&
          onChange({
            value: copyVal,
          });
      }
    }
  };

  const findCard = useCallback(
    (name) => {
      const column = internalColumns.filter((c) => c.name === name)[0];
      return {
        column,
        index: internalColumns.indexOf(column),
      };
    },
    [internalColumns]
  );
  const moveCard = (index, atIndex) => {
    const updatedCols = update(internalColumns, {
      $splice: [
        [index, 1],
        [atIndex, 0, internalColumns[index]],
      ],
    });
    setInternalColumns(updatedCols);
    const colOrder = {};
    updatedCols.forEach((key, idx) => {
      colOrder[key.name] = idx;
    });
    onColumReorder && onColumReorder(colOrder);
    onChange &&
      onChange({
        value: updatedCols.filter((col) => Array.isArray(value) && value.indexOf(col.name) > -1).map((i) => i.name),
      });
  };
  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));
  return (
    <div className={`sq-grid__col-filters`} role="column-filter">
      <div className="sq-grid__col-filters__header">
        <Checkbox checked={hasAllSelection} onChange={handleSelectAll} text={'Select All'} />
      </div>
      <div className="sq-grid__col-filters__body">
        <div ref={drop} className={`sq-grid__col-filters__list`}>
          {internalColumns.map((col, i) => (
            <Card key={col.name} id={col.name} fixed={col.fixed || col.customize === false} index={i} name={`${col.name}`} text={col.headerText || col.name} moveCard={moveCard} findCard={findCard}>
              <div className={`sq-grid__col-filters__item`} key={`col-${col.name}`}>
                <Icon name="DragHandle" /> <Checkbox className="sq-grid__col-filters__checkbox" onChange={(value) => handleChange(value, col)} disabled={col.customize === false} checked={col.customize === false || (Array.isArray(value) && value.indexOf(col.name) > -1)} text={col.headerText || string.titleCase(col.name) || 'No Name'} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = memo(function Card({ id, children, index, moveCard, fixed }:any) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item:any, monitor:any) {
      if (!ref.current || fixed === true || item.fixed == true) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index, fixed };
    },
    canDrag: !fixed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...style, ...(fixed ? fixedStyles : {}), opacity }} data-handler-id={handlerId}>
      {children}
    </div>
  );
});

GridColumnFilter.propTypes = {
  errors: PropTypes.object,
  column: PropTypes.object,
  value: PropTypes.any,
  row: PropTypes.object,
  formatter: PropTypes.object,
  onAction: PropTypes.func,
  onChange: PropTypes.func,
  onAnalytics: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  beforeRender: PropTypes.func,
};

export default GridColumnFilter;
