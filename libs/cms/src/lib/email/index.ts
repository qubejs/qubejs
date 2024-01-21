import helpers from './helpers';

let allTemplates = {};
const templates = () => {
  return allTemplates;
};
const set = (newTemplates) => {
  allTemplates = {
    ...allTemplates,
    ...newTemplates,
  };
};
export { templates, set, helpers };
