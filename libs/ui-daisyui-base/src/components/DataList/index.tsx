import React from 'react';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '../../daisy/ui/item';
import Icon from '../Icon';

const DataList = ({ className = '', items = [] }: any) => {
  return (
    <div className={`sq-data-list ${className}`}>
      <ItemGroup>
        {items.map((item, idx) => {
          const { icon = {} } = item;
          return (
            <React.Fragment key={`li-${idx}`}>
              <Item size="sm" className="sq-data-list__item">
                <ItemMedia>
                  <Icon name={item.iconName} {...icon} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{item.title}</ItemTitle>
                  {item.subTitle && <ItemDescription>{item.subTitle}</ItemDescription>}
                </ItemContent>
              </Item>
              {item.items && item.items.length > 0 && (
                <DataList className={`sq-data-list__child pl-6`} items={item.items} />
              )}
            </React.Fragment>
          );
        })}
      </ItemGroup>
    </div>
  );
};

export default DataList;
