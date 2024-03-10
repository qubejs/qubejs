import { useState } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';

const Repeater = ({
  className = '',
  itemClassName = '',
  data,
  dataGroup = {},
  options = {},
  loader,
  onAction,
  template = () => {
    return <div>{`Template not defined`}</div>;
  },
  noDataTemplate = () => {
    return <div className='sq-repeater__no-data-message'>{`No data found`}</div>;
  },
  groupTemplate = () => {
    return <div>{`Group Template not defined`}</div>;
  }
}: any) => {
  const Template = template;
  const [selectedGroups, setSelectedGroup] = useState({});
  const GroupTemplate = groupTemplate;
  const { field: groupField } = dataGroup;
  let groupData;
  if (groupField) {
    groupData = groupBy(data, groupField);
  }

  const handleOnGroupClick = (group) => {
    setSelectedGroup({
      ...selectedGroups,
      [group]: !selectedGroups[group]
    });
  };

  return (
    <div className={`sq-repeater ${className}`}>
      {!data && loader}
      {data && data.length === 0 && noDataTemplate()}
      {data && groupData &&
        Object.keys(groupData).map((groupKey, index) => {
          const items = groupData[groupKey];
          const isActive = !!selectedGroups[groupKey];
          return (
            <div key={index} className={`sq-repeater__group ${isActive ? 'sq-repeater__group--active' : ''}`}>
              <div className="sq-repeater__group-header" onClick={() => handleOnGroupClick(groupKey)}>
                <GroupTemplate
                  data={{
                    group: groupKey,
                    items
                  }}
                  index={index}
                  onAction={onAction}
                  options={options}
                  active={isActive}
                />
              </div>
              <div className="sq-repeater__group-body">
                {items &&
                  items.map((dataItem, index) => {
                    return (
                      <div className={`sq-repeater__item ${itemClassName}`} key={index}>
                        <Template index={index} data={dataItem} options={options} />
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      {data && !groupData &&
        data.map((dataItem, index) => {
          return (
            <div className={`sq-repeater__item ${itemClassName}`} key={index}>
              <Template data={dataItem} index={index} options={options} onAction={onAction} />
            </div>
          );
        })}
    </div>
  );
};

Repeater.propTypes = {
  template: PropTypes.func,
  groupTemplate: PropTypes.func,
  onAction: PropTypes.func,
  options: PropTypes.object,
  className: PropTypes.string,
  data: PropTypes.array
};

export default Repeater;
