import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LinkButton from '../../components/LinkButton';
import { utils, reducers } from '@qubejs/web-react';

const { query } = utils.queryString;
const { Validator } = utils.validator;
const { processParams } = reducers.content;

const hasPermission = (item, permissions) => {
  let result = false;
  if (permissions.indexOf(item.key) > -1 || !item.key) {
    result = true;
  }
  return result;
};
const pathWithParamMatch = (itemHref, path) => {
  const leftHref = itemHref.split('/');
  const rightHref = path.split('/');
  const params = {};
  let matched = true;
  if (leftHref.length === rightHref.length) {
    rightHref.forEach((urlPart, idx) => {
      if (leftHref[idx].startsWith(':')) {
        params[leftHref[idx].substr(1)] = urlPart;
      } else if (urlPart !== leftHref[idx]) {
        matched = false;
      }
    });
  } else {
    matched = false;
  }

  return {
    matched,
    params,
  };
};

const findNode = (data, path, permissions, parents = [], userData, appStore) => {
  let returnItems = [];
  data.forEach((item) => {
    let newList;
    if (item.children) {
      parents.push(item);
      newList = findNode(item.children, path, permissions, parents, userData, appStore);
    }
    if (newList?.length > 0) {
      returnItems = newList.concat(returnItems);
    }
    let isValid = true;
    if (item.match) {
      const valid = new Validator(item.match);
      valid.setValues(userData);
      isValid = valid.validateAll();
    }
    let paramMatcher;
    if (item.href?.toString().indexOf('/:') > -1) {
      paramMatcher = pathWithParamMatch(item.href, path);
    }
    if (isValid && (item.href?.toString().toLowerCase() === path?.toString().toLowerCase() || (paramMatcher && paramMatcher.matched))) {
      if (parents) {
        parents.forEach((parent) => {
          if (parent.href && hasPermission(parent, permissions)) {
            returnItems.push({
              cmpType: 'Link',
              ...parent,
            });
          } else {
            returnItems.push({
              cmpType: 'Text',
              ...parent,
            });
          }
        });
      }
      returnItems.push({
        cmpType: 'Text',
        ...item,
      });
    }
  });
  if (returnItems.length === 0) {
    parents = parents.pop();
  }
  return returnItems;
};

const BreadCrumb = ({ showGroupHeader = true, navigation, currentPath, permissions = [], breadcrumb, userData, appStore }:any) => {
  if (breadcrumb && breadcrumb.root) {
    currentPath = breadcrumb.root;
  }
  let finalData = findNode(navigation, currentPath, permissions, undefined, userData, appStore);

  finalData = finalData.map((dataItem) => {
    const override = breadcrumb?.map[dataItem.href] || null;
    return {
      ...dataItem,
      ...override,
      cmpType: override ? 'Link' : dataItem.cmpType,
      title: dataItem.dynamicTextField ? (processParams(userData, {buttonText: dataItem.dynamicTextField}, undefined, appStore)).buttonText :  override?.title || dataItem.title,
    };
  });
  if (breadcrumb?.items) {
    finalData = finalData.concat(breadcrumb.items);
  }
  let urlForParams = {};
  finalData.forEach((item) => {
    const result = item.href && pathWithParamMatch(item.href, currentPath);
    if (result?.params) {
      urlForParams = {
        ...urlForParams,
        ...result.params,
      };
    }
  });
  return (
    <div className="sq-bread-crumbs">
      {finalData?.length > 0 && <div className="sq-bread-crumbs__container">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            {finalData.map((item:any, idx: number) => {
              const finalUserData:any = { ...userData, ...urlForParams, ...query.get() };
              const finalItem = processParams(finalUserData, item, undefined, appStore);
              const finalParams:any = finalItem.urlParams;
              if (item.cmpType === 'Link') {
                return [showGroupHeader && finalItem.header && idx === 0 && <Typography key={finalItem.href}>{finalItem.header}</Typography>, finalItem.href && <LinkButton key={finalItem.href} buttonText={finalItem.title} to={finalItem.href} urlParams={finalParams}></LinkButton>];
              }
              return [showGroupHeader && finalItem.header && idx === 0 && <Typography key={finalItem.href}>{finalItem.header}</Typography>, finalItem.href && <Typography key={item.href}>{item.title}</Typography>];
            })}
        </Breadcrumbs>
      </div>}
    </div>
  );
};

BreadCrumb.propTypes = {
  navigation: PropTypes.array,
  userData: PropTypes.object,
  appStore: PropTypes.object,
  breadcrumb: PropTypes.array,
  roles: PropTypes.array,
  permissions: PropTypes.array,
  onClick: PropTypes.func,
  currentPath: PropTypes.string,
  logo: PropTypes.object,
};
export default BreadCrumb;
