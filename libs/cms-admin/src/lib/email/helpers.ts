import { utils } from '@qubejs/core';
const { object } = utils;

let dataItems = {};

function setDataItems(newData) {
  dataItems = { ...dataItems, ...newData };
}

function processBody(html, data) {
  const dataToProcess = {
    ...dataItems,
    ...data,
  };
  return object.processMessage(html, dataToProcess, { removePrefix: 'data.' });
}

export default {
  processBody,
  setDataItems,
};
