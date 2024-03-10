import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Icon from '../Icon';

const DataList = ({ className = '', items = [] }: any) => {
  return (
    <div className={`sq-data-list ${className}`}>
      <List>
        {items.map((item, idx) => {
          const { icon = {} } = item;
          return (
            <React.Fragment key={`li-${idx}`}>
              <ListItem>
                <ListItemIcon>
                  <Icon name={item.iconName} {...icon} />
                </ListItemIcon>
                <ListItemText primary={item.title} secondary={item.subTitle ? item.subTitle : null} />
              </ListItem>
              {item.items && item.items.length > 0 && <DataList className={`sq-data-list__child`} items={item.items} />}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
};

export default DataList;
