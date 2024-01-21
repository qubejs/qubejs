import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Tooltip from '@mui/material/Tooltip';
import ErrorBoundary from '../../components/ErrorBoundry';
import Dialog from '../../components/Dialog';
import DynamicContentRoot from '../DynamicContent';
import { Placeholder } from './Placeholder';
import Actions from '../../components/Actions';

class ComponentEditor extends Component {
  props:any;
  state:any;
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = { openSettings: false, active: false };
    this.toggleEditForm = this.toggleEditForm.bind(this);
    this.saveFormData = this.saveFormData.bind(this);
    this.cancelChanges = this.cancelChanges.bind(this);
    this.saveFormElData = this.saveFormElData.bind(this);
    this.onComponentDrop = this.onComponentDrop.bind(this);
    this.deleteComponentByIdx = this.deleteComponentByIdx.bind(this);
    this.deleteComponent = this.deleteComponent.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.moveElemDown = this.moveElemDown.bind(this);
    this.moveElemUp = this.moveElemUp.bind(this);
  }

  toggleEditForm() {
    this.setState({
      openSettings: !this.state.openSettings,
    });
  }

  cancelChanges() {
    this.toggleEditForm();
  }
  saveFormData(data) {
    const { onChange } = this.props;
    onChange && onChange(data);
    this.toggleEditForm();
  }
  saveFormElData(data, idx) {
    const { onChange, itemsPropName, value = {} } = this.props;
    const finalData = {
      ...value,
      [itemsPropName]: [...((value && value[itemsPropName]) || [])],
    };
    finalData[itemsPropName][idx] = {
      ...finalData[itemsPropName][idx],
      ...data,
    };
    onChange && onChange(finalData);
  }
  deleteComponentByIdx(idx) {
    const { onChange, itemsPropName, value = {} } = this.props;
    const finalData = {
      ...value,
      [itemsPropName]: [...((value && value[itemsPropName]) || [])],
    };
    finalData[itemsPropName].splice(idx, 1);
    onChange && onChange(finalData);
  }

  deleteComponent() {
    const { onDelete } = this.props;
    onDelete && onDelete();
  }

  getName(name, items) {
    let idx = 1;
    let loop = 0;
    let fname = name.toLowerCase();
    while (items && loop < items.length) {
      if (items.filter((i) => i.name === `${fname}${idx}`).length > 0) {
        idx++;
      } else {
        break;
      }
    }
    return `${fname}${idx}`;
  }

  onComponentDrop(dataComp, evt, idx) {
    const { metaData, ...data } = dataComp;
    const { onChange, itemsPropName, compTypeProp, value } = this.props;
    let finalData;
    if (idx !== undefined) {
      const itemArra = [...((value && value[itemsPropName]) || [])];
      itemArra.splice(idx, 0, {
        [compTypeProp]: data.name,
        ...metaData.sampleData,
        ...data,
        name: this.getName(data.name, value[itemsPropName]), // `${value.name}${value.name ? '_' : ''}${data.name?.toLowerCase()}_${value[itemsPropName]?.length + 1 || 1}`,
      });
      finalData = {
        ...value,
        [itemsPropName]: itemArra,
      };
    } else {
      finalData = {
        ...value,
        [itemsPropName]: [
          ...((value && value[itemsPropName]) || []),
          {
            [compTypeProp]: data.name,
            ...metaData.sampleData,
            ...data,
            name: this.getName(data.name, value[itemsPropName]), //`${value.name}${value.name ? '_' : ''}${data.name?.toLowerCase()}_${value[itemsPropName]?.length + 1 || 1}`,
          },
        ],
      };
    }

    onChange && onChange(finalData);
  }

  moveUp() {
    const { onMoveUp } = this.props;
    onMoveUp && onMoveUp();
  }

  moveDown() {
    const { onMoveDown } = this.props;
    onMoveDown && onMoveDown();
  }
  moveElemUp(index) {
    const { onChange, itemsPropName, compTypeProp, value } = this.props;
    const items = (value && value[itemsPropName]) || [];
    let updatedCols = update(items, {
      $splice: [
        [index, 1],
        [index - 1, 0, items[index]],
      ],
    });
    const finalData = {
      ...value,
      [itemsPropName]: updatedCols,
    };
    onChange && onChange(finalData);
  }

  moveElemDown(index) {
    const { onChange, itemsPropName, compTypeProp, value } = this.props;
    const items = (value && value[itemsPropName]) || [];
    let updatedCols = update(items, {
      $splice: [
        [index, 1],
        [index + 1, 0, items[index]],
      ],
    });
    const finalData = {
      ...value,
      [itemsPropName]: updatedCols,
    };
    onChange && onChange(finalData);
  }
  // TODO:
  // onMouseEnter(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   this.setState({ active: true });
  // }
  // onMouseLeave(e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   this.setState({ active: false });
  // }

  render() {
    const { pageData = {}, Component, fieldsMeta, idx, itemsPropName, name, isStart, isEnd, value, compTypeProp, component, editData } = this.props;
    const { hasItems } = this.props;
    const { [itemsPropName]: items } = value || {};
    const { className = '' } = pageData;
    const { hasPlaceholder, accept, compList, defaultComp } = this.props;
    const identifier = `${component}${value.className ? `.${value.className}` : ''}${value.name ? `#${value.name}` : ''}`;
    return (
      <div
        className={`sq-component-editor ${className} ${this.state.active ? 'active' : ''} ${value.className || ''}`}
      >
        <Dialog
          classes={{
            dialog: {
              root: 'sq-dialog--fixed-right',
            },
          }}
          backDropClick={false}
          disableEscapeKeyDown
          onClose={this.toggleEditForm}
          title={`${component} Configuration`}
          open={this.state.openSettings}
        >
          <div className="mt-wide">
            {editData && (
              <DynamicContentRoot
                pageConfig={editData}
                keyPressChange={false}
                initialData={{
                  main: value,
                  fieldsMeta,
                }}
                onSubmit={this.saveFormData}
                onCancel={this.cancelChanges}
              />
            )}
          </div>
        </Dialog>
        <Tooltip title={identifier}>
          <div className="sq-component-editor__name">
            {component}
            {value.name ? `#${value.name}` : ''}
            {value.className ? `.${value.className}` : ''}
          </div>
        </Tooltip>
        {/* <IconButton className="sq-component-editor__move" iconName={'Move'} /> */}
        <div className="sq-component-editor__actions">
          <Actions
            actions={[
              { cmpType: 'IconButton', size: 'small', iconSize: 'small', iconName: 'arrow-up', onClick: this.moveUp, beforeRender: () => !isStart },
              { cmpType: 'IconButton', size: 'small', iconSize: 'small', iconName: 'arrow-down', onClick: this.moveDown, beforeRender: () => !isEnd },
              { cmpType: 'IconButton', size: 'small', iconSize: 'small', iconName: 'Settings', onClick: this.toggleEditForm },
              {
                cmpType: 'IconButton',
                size: 'small',
                iconSize: 'small',
                iconName: 'Delete',
                onClick: this.deleteComponent,
                confirm: {
                  title: 'Delete?',
                  content: 'Are you sure you want to delete?',
                },
              },
            ]}
          />
        </div>
        <div className={`sq-component-editor__container ${value.bodyClassName}`}>
          <ErrorBoundary>
            {!hasItems && (
              <ErrorBoundary>
                {Component && <Component {...value} />}
                {!Component && <div className="text-center">Preview not available</div>}
              </ErrorBoundary>
            )}
            {hasItems &&
              items &&
              items.map((item, idx) => {
                const Component = compList[item[compTypeProp]] || (!item[compTypeProp] && defaultComp ? compList[defaultComp] : compList.Custom);
                const { [compTypeProp]: cmpType, ...restItem } = item;
                return (
                  <ErrorBoundary key={idx}>
                    {hasPlaceholder && (
                      <Placeholder
                        hoverText={identifier}
                        plaecHolderStyle="line"
                        name={value.name}
                        component={component}
                        accept={accept}
                        onDrop={(d, evt) => this.onComponentDrop(d, evt, idx)}
                      />
                    )}
                    <ComponentEditor
                      idx={idx}
                      parentName={item.name}
                      fieldsMeta={fieldsMeta}
                      accept={accept}
                      component={item[compTypeProp] || defaultComp}
                      isStart={idx === 0}
                      isEnd={idx === items.length - 1}
                      index={idx}
                      itemsPropName={itemsPropName}
                      compList={compList}
                      {...Component}
                      value={item}
                      onDelete={() => this.deleteComponentByIdx(idx)}
                      onChange={(data) => this.saveFormElData(data, idx)}
                      onMoveUp={() => this.moveElemUp(idx)}
                      onMoveDown={() => this.moveElemDown(idx)}
                    />
                  </ErrorBoundary>
                );
              })}
          </ErrorBoundary>
        </div>
        {hasPlaceholder && (
          <Placeholder hoverText={identifier} plaecHolderStyle={(!items || items?.length === 0) ? undefined : 'line'} name={value.name} component={component} accept={accept} onDrop={this.onComponentDrop} />
        )}
      </div>
    );
  }
}

ComponentEditor.propTypes = {
  data: PropTypes.object,
};

export default ComponentEditor;
