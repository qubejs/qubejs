import { GroupStorage, Storage, PreferenceStorage } from './comp-storage';

const icons = new GroupStorage();
const components = new Storage();
const containers = new Storage();
const dynamicComponents = new Storage();
const charts = new Storage();
const pageBuilder = new Storage();
const richText = new Storage();
const preference = new PreferenceStorage();
const settings = new Storage();

export { icons, components, containers, dynamicComponents, pageBuilder, preference, richText, charts, settings };
