import React from 'react';
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '../../daisy/ui/item';
import TextFields from '../TextFields';
import Icon from '../Icon';

const ItemList = ({ data, title, textField, fields, valueField, itemTemplate, iconField, iconProps = {}, iconType = 'img', noDataMessage = 'No data found', onAction, clickAction, ...rest }: any) => {
  return (
    <div className="sq-item-list">
      <nav aria-labelledby="nested-list-subheader">
        <div id="nested-list-subheader" className="sq-item-list__header px-3 py-2 text-sm font-medium text-muted-foreground">
          {title}
        </div>
        {data && data.length === 0 && noDataMessage}
        <ItemGroup>
          {data &&
            data.map((dataItem, index) => {
              return (
                <Item
                  key={index}
                  asChild
                  size="sm"
                  className="cursor-pointer hover:bg-muted"
                >
                  <button
                    type="button"
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
                          <ItemMedia>
                            {iconType === 'img' && <img alt={dataItem[textField]} src={dataItem[iconField]}></img>}
                            {iconType === 'icon' && <Icon textIcon={dataItem[textField].substr(0, 1)} name={dataItem[iconField]} {...iconProps} />}
                          </ItemMedia>
                        )}
                        {!fields && (
                          <ItemContent>
                            <ItemTitle>{dataItem[textField]}</ItemTitle>
                          </ItemContent>
                        )}
                        {fields && <TextFields fields={fields} row={dataItem} value={dataItem} {...rest} />}
                      </>
                    )}
                  </button>
                </Item>
              );
            })}
        </ItemGroup>
      </nav>
    </div>
  );
};

ItemList.propTypes = {};

export default ItemList;
