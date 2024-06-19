import React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextFields from '../TextFields';
import Icon from '../Icon';

const ItemList = ({ data, title, textField, fields, valueField, itemTemplate, iconField, iconProps = {}, iconType = 'img', noDataMessage = 'No data found', onAction, clickAction, ...rest }: any) => {
  return (
    <div className="sq-item-list">
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {title}
          </ListSubheader>
        }
      >
        {data && data.length === 0 && noDataMessage}
        {data &&
          data.map((dataItem, index) => {
            return (
              <ListItem
                key={index}
                button
                onClick={() => {
                  if (clickAction) {
                    onAction && onAction(dataItem[valueField], { ...clickAction, currentData: dataItem });
                  }
                }}
              >
                {itemTemplate && itemTemplate(dataItem)}
                {!itemTemplate && (
                  <>
                    {iconField && (
                      <ListItemIcon>
                        {iconType === 'img' && <img alt={dataItem[textField]} src={dataItem[iconField]}></img>}
                        {iconType === 'icon' && <Icon textIcon={dataItem[textField].substr(0, 1)} name={dataItem[iconField]} {...iconProps} />}
                      </ListItemIcon>
                    )}
                    {!fields && <ListItemText primary={dataItem[textField]} />}
                    {fields && <TextFields fields={fields} row={dataItem} value={dataItem} {...rest} />}
                  </>
                )}
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

ItemList.propTypes = {};

export default ItemList;
