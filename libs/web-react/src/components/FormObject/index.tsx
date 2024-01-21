import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../Form';
import IconButton from '../IconButton';
import Dialog from '../Dialog';
import Alert from '../Alert';

class FormObject extends Component {
  props:any;
  static propTypes:any;
  state: any;
  constructor(props) {
    super(props);
    this.state = { expandFull: true, data: [], objMap: {}, objArray: {}, fullScreen: false, expandItems: {} };
    this.addNew = this.addNew.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.convertToObj = this.convertToObj.bind(this);
    this.convertToArr = this.convertToArr.bind(this);
    this.valueOnChange = this.valueOnChange.bind(this);
    this.changeToArray = this.changeToArray.bind(this);
    this.formOnAction = this.formOnAction.bind(this);
    this.changeToObject = this.changeToObject.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
    this.replaceFromText = this.replaceFromText.bind(this);
    this.onFormTextChange = this.onFormTextChange.bind(this);
    this.expandItem = this.expandItem.bind(this);
  }
  valueOnChange(data, key, isArray) {
    const { onChange, value = {} }: any = this.props;
    const objVal = isArray ? [...value] : { ...value };
    let oldValue;
    if (!isArray && key !== data.value.key) {
      oldValue = objVal[key];
      delete objVal[key];
    }
    if (!isArray) {
      objVal[data.value.key] = oldValue || data.value.value;
    } else {
      objVal[data.value.key * 1] = oldValue || data.value.value;
    }

    onChange &&
      onChange({
        value: objVal,
      });
  }

  isObject(val) {
    return typeof val === 'object';
  }
  isArray(val) {
    return Array.isArray(val) && typeof val === 'object';
  }

  formOnAction(action, key, isArray) {
    switch (action.actionType) {
      case 'object':
        this.convertToObj(key, isArray);
        break;
      case 'array':
        this.convertToArr(key, isArray);
        break;
      case 'bool':
        this.convertToBool(key, isArray);
        break;
    }
  }

  removeItem(key, isArray) {
    const { onChange, value = {} }:any = this.props;
    const objVal = isArray ? [...value] : { ...value };
    !isArray && delete objVal[key];
    isArray && objVal.splice(key * 1, 1);
    const newMap = { ...this.state.objMap };
    delete newMap[key];
    this.setState({
      objMap: newMap,
    });

    onChange &&
      onChange({
        value: objVal,
      });
  }

  convertToObj(key, isArray) {
    const { value = {}, onChange }:any = this.props;
    this.setState({
      objMap: {
        ...this.state.objMap,
        [key]: true,
      },
    });
    onChange &&
      onChange({
        value: {
          ...value,
          [key]: isArray
            ? [value[key]]
            : {
                child: value[key],
              },
        },
      });
  }
  convertToBool(key, isArray) {
    const { value = {}, onChange }:any = this.props;
    this.setState({
      objMap: {
        ...this.state.objMap,
        [key]: false,
      },
      objArray: {
        ...this.state.objArray,
        [key]: false,
      },
    });
    onChange &&
      onChange({
        value: {
          ...value,
          [key]: Boolean(value[key].toString()),
        },
      });
  }

  convertToArr(key, isArray) {
    const { value = {}, onChange }:any = this.props;
    this.setState({
      objArray: {
        ...this.state.objArray,
        [key]: true,
      },
    });
    onChange &&
      onChange({
        value: {
          ...value,
          [key]: [
            {
              child: value[key],
            },
          ],
        },
      });
  }

  changeToArray() {
    const { onChange, value = {} }:any = this.props;
    onChange &&
      onChange({
        value: [value],
      });
  }
  changeToObject() {
    const { onChange, value }:any = this.props;
    onChange &&
      onChange({
        value: Array.isArray(value) ? value[0] : {},
      });
  }

  addNew(isArray) {
    const { onChange, value = {}, keyName = 'key' }:any = this.props;
    let idx = 0;
    if (!isArray) {
      while (value[keyName + idx] || value[keyName + idx] === '') {
        idx++;
      }
    }
    this.setState({
      expandFull: true,
    });
    onChange &&
      onChange({
        value: isArray ? [...value, {}] : { ...value, [keyName + idx]: '' },
      });
  }

  onFormTextChange(data) {
    this.setState({
      currentTxt: {
        currentError: '',
        text: data.value?.text,
      },
    });
  }
  replaceFromText() {
    this.setState({
      openText: true,
      currentError: '',
      currentTxt: {
        text: JSON.stringify(this.props.value || {}, null, 4),
      },
    });
  }

  toggleFullScreen() {
    this.setState({
      fullScreen: !this.state.fullScreen,
    });
  }

  handleAction(data, dialogAction) {
    const { onChange } = this.props;
    switch (dialogAction.action) {
      case 'cancel':
        this.setState({
          openText: false,
        });
        break;
      case 'ok':
        try {
          const obj = JSON.parse(this.state.currentTxt.text);
          const isArray = Array.isArray(obj);
          onChange &&
            onChange({
              value: isArray ? [...obj] : { ...obj },
            });
          this.setState({
            openText: false,
          })
        } catch (ex) {
          this.setState({
            currentError: 'JSON parse failed',
          });
        }
        
        break;
    }
  }

  expandItem(itemKey) {
    this.setState({
      expandItems: {
        ...this.state.expandItems,
        [itemKey]: !this.state.expandItems[itemKey],
      }
    });
  }

  render() {
    const { className = '', label, fields, value = {}, formClassName = 'sq-form--keyval-mode', type, ...rest } = this.props;
    const _isArray = this.isArray(value);
    return (
      <div className={`sq-form-object ${className} ${this.state.fullScreen ? 'sq-form-object--full-screen' : ''}`}>
        <Dialog
          title={'Replace with Text Data'}
          classes={{
            body: 'sq-dialog__content-body--standard',
          }}
          closeButton={true}
          open={this.state.openText}
          onAction={(data, dialogAction) => this.handleAction(data, dialogAction)}
          onClose={() => this.setState({ openText: false })}
          actions={[
            {
              buttonText: 'Save',
              action: 'ok',
            },
            {
              buttonText: 'Cancel',
              variant: 'outlined',
              action: 'cancel',
            },
          ]}
        >
          <Form
            className={'pb-none'}
            fields={[
              {
                name: 'text',
                cmpType: 'Textarea',
                label: 'Text Data',
                minRows: 30,
              },
            ]}
            value={this.state.currentTxt}
            onChange={this.onFormTextChange}
          />
          {this.state.currentError && <Alert message={this.state.currentError} type="warning" />}
        </Dialog>
        <div className="sq-form-object__top-actions mb-1">
          {!this.state.expandFull && label && <IconButton className='sq-form-object__expand-collapse' iconSize="small" iconName="add-circle-outline" title="Expand" color="warning" size="small" onClick={() => this.setState({ expandFull: true})} />}
          {this.state.expandFull && label && <IconButton className='sq-form-object__expand-collapse' iconSize="small" iconName="remove-circle-outline" title="Collapse" color="warning" size="small" onClick={() => this.setState({ expandFull: false})} />}
          {label && <div className="sq-form-object__label">{label}</div>}
          <IconButton className={label ? '' : 'sq-form-object__float-full'} iconSize="small" iconName={this.state.fullScreen ? 'FullscreenExit' : 'Fullscreen'} onClick={this.toggleFullScreen} />
        </div>
        {this.state.expandFull && value &&
          Object.keys(value).map((itemKey, idx) => {
            const itemVal = { key: itemKey, value: value[itemKey] };
            const isObject = this.state.objMap[itemKey] || this.isObject(itemVal.value);
            const isInternalArray = this.state.objArray[itemKey] || this.isArray(itemVal.value);
            const finalClassName = !isObject ? formClassName : 'sq-form--object-mode';
            return (
              <div className="sq-form-object__item" key={itemVal.key}>
                <div className="sq-form-object__item-wrap">
                  {isObject && !this.state.expandItems[itemKey] && <IconButton className='sq-form-object__expand-collapse' iconSize="small" iconName="add-circle-outline" title="Expand" color="info" size="small" onClick={() => this.expandItem(itemKey)} />}
                  {isObject && this.state.expandItems[itemKey] && <IconButton className='sq-form-object__expand-collapse' iconSize="small" iconName="remove-circle-outline" title="Collapse" color="info" size="small" onClick={() => this.expandItem(itemKey)} />}
                  <Form
                    onAnalytics={rest.onAnalytics}
                    userData={rest.userData}
                    className={`pb-0 ${finalClassName}`}
                    fields={
                      fields || [
                        {
                          cmpType: _isArray ? 'Text' : 'EditableField',
                          name: 'key',

                          editProps: {
                            label: 'Key',
                            disabled: _isArray,
                          },
                        },
                        (!isObject && this.state.expandFull) || this.state.expandItems[itemKey] ? {
                          cmpType: isObject ? 'FormObject' : 'EditableField',
                          name: 'value',
                          editType: typeof itemVal.value === 'boolean' ? 'Switch' : 'Input',
                          label: isObject ? '' : 'Value',
                          editProps: {
                            label: 'Value',
                          },
                        } : undefined,
                      ].filter(i => !!i )
                    }
                    value={itemVal}
                    onChange={(data) => this.valueOnChange(data, itemKey, _isArray)}
                  />
                  {!fields && !isObject && !isInternalArray && <IconButton iconSize="small" title={'Convert to object'} iconName="DataObject" color="success" size="small" onClick={() => this.convertToObj(itemKey, _isArray)} />}
                  {!fields && !isObject && !isInternalArray && <IconButton iconSize="small" title={'Convert to array'} iconName="DataArray" color="success" size="small" onClick={() => this.convertToArr(itemKey, _isArray)} />}
                  {!fields && !isObject && !isInternalArray && <IconButton iconSize="small" title={'Convert to bool'} iconName="Code" color="info" size="small" onClick={() => this.convertToBool(itemKey, _isArray)} />}
                  <IconButton iconSize="small" iconName="Delete" title="Delete" color="error" size="small" onClick={() => this.removeItem(itemKey, _isArray)} />
                </div>
              </div>
            );
          })}
        <div className="sq-form-object__actions">
          <IconButton iconSize="small" iconName="add" title={'Add'} onClick={() => this.addNew(_isArray)} />
          <IconButton iconSize="small" iconName="code" title={'Replace with Text'} onClick={this.replaceFromText} />
          {!_isArray && <IconButton iconSize="small" title={'Convert to array'} iconName="DataArray" color="info" size="small" onClick={() => this.changeToArray()} />}
          {_isArray && <IconButton iconSize="small" title={'Convert to object'} iconName="DataObject" color="success" size="small" onClick={() => this.changeToObject()} />}
        </div>
      </div>
    );
  }
}

FormObject.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default FormObject;
