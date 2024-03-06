
import { utils } from '@qubejs/core';

const { Validator } = utils.validator;

export const hasActive = (nav, naviagateChild = true, userData?) => {
    let isActive = false;
    let isValidMatch = true;
    if (nav.match) {
      const valid = new Validator(nav.match);
      valid.setValues(userData);
      isValidMatch = valid.validateAll();
    }
    if (isValidMatch && nav.href === window.location.pathname) {
      return true;
    }
    if (naviagateChild && nav.children) {
      isActive = checkChildren(nav.children, window.location.pathname, userData);
    }
    return isActive;
  };
  
  export const hasMatchingRoles = (roles, userRoles) => {
    let hasRole = roles ? false : true;
    if (roles && userRoles.length > 0) {
      if (roles.indexOf(userRoles[0]) > -1) {
        hasRole = true;
      }
    }
    return hasRole;
  };
  
  export const hasPermission = (item, options:any = {}, children = true) => {
    let result = false;
    if (!item.hideInMenu && (options?.permissions?.indexOf(item.key) > -1 || !item.key) && (hasMatchingRoles(item.roles, options.roles) || !item.roles)) {
      return true;
    }
  
    children &&
      item?.children?.forEach((childItem) => {
        if (!childItem.hideInMenu && options?.permissions?.indexOf(childItem.key) > -1 && (hasMatchingRoles(item.roles, options.roles) || !item.roles)) {
          result = true;
        }
      });
    return result;
  };
  
  export const checkChildren = (children, path, userData) => {
    let isActive = false;
    children.forEach((child) => {
      if (!isActive && child.children?.length > 0) {
        isActive = checkChildren(child.children, path, userData);
      }
      let isValidMatch = true;
      if (child.match) {
        const valid = new Validator(child.match);
        valid.setValues(userData);
        isValidMatch = valid.validateAll();
      }
      if (isValidMatch && !isActive && child.href === path) {
        isActive = true;
      }
    });
    return isActive;
  };