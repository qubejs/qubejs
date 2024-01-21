import { useState } from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Input from '../Input';
import Icon from '../Icon';

const applyFilter = (data, _filter, fields = []) => {
  if (!_filter) {
    return data;
  }
  const items = filter(data, (item) => {
    let isMatch = false;
    Object.keys(item).forEach((fieldName) => {
      if (fields.indexOf(fieldName) > -1) {
        if (!isMatch) {
          isMatch = new RegExp(_filter, 'gi').test(item[fieldName]);
        }
      }
    });
    return isMatch;
  });
  return items;
};

const ItemList = ({
  data,
  title,
  textField,
  labelSearch,
  valueField,
  itemTemplate,
  iconField,
  iconProps = {},
  iconType = 'img',
  onSelect,
  noDataMessage = 'No data found',
}: any) => {
  const [timer, setTimerData] = useState(undefined);
  const [filterData, setData] = useState(data); // applyFilter(data, filterText, [textField, valueField]);
  return (
    <div className="sq-select-popup-item-list">
      <Input
        label={labelSearch}
        onKeyPress={(inputData) => {
          if (timer) {
            clearTimeout(timer);
            setTimerData(undefined);
          }
          setTimerData(
            window.setTimeout(() => {
              setData(
                applyFilter(data, inputData.value, [textField, valueField])
              );
            }, 500)
          );
        }}
      />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {title}
          </ListSubheader>
        }
      >
        {filterData && filterData.length === 0 && noDataMessage}
        {filterData &&
          filterData.map((dataItem, index) => {
            return (
              <ListItem
                key={index}
                button
                onClick={() => {
                  onSelect && onSelect(dataItem[valueField], dataItem);
                }}
              >
                {itemTemplate && itemTemplate(dataItem)}
                {!itemTemplate && (
                  <>
                    {iconField && (
                      <ListItemIcon>
                        {iconType === 'img' && (
                          <img
                            alt={dataItem[textField]}
                            src={dataItem[iconField]}
                          ></img>
                        )}
                        {iconType === 'icon' && (
                          <Icon
                            textIcon={dataItem[textField].substr(0, 1)}
                            name={dataItem[iconField]}
                            {...iconProps}
                          />
                        )}
                      </ListItemIcon>
                    )}
                    <ListItemText primary={dataItem[textField]} />
                  </>
                )}
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

ItemList.propTypes = {
  onSelect: PropTypes.func,
  data: PropTypes.array,
  title: PropTypes.string,
  textField: PropTypes.string,
  labelSearch: PropTypes.string,
  valueField: PropTypes.string,
  itemTemplate: PropTypes.string,
  iconField: PropTypes.string,
  iconProps: PropTypes.object,
  iconType: PropTypes.string,
  noDataMessage: PropTypes.string,
};

export default ItemList;
