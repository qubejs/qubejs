
let languages = {
  en: {
    messages: {

    }
  }
};

// window.getLangs = () => {
//   return languages;
// }

const localStorage = window.localStorage;
let currentLanguage = localStorage.getItem('lang') || 'en';

const translate = (message) => {
  // if ((languages[currentLanguage] &&
  //   !languages[currentLanguage].messages[message])) {
  //   languages[currentLanguage].messages[message] = message;
  // }
  return (languages[currentLanguage] &&
    languages[currentLanguage].messages[message]) ||
    languages.en.messages[message] || message;
};

const set = (lang) => {
  if (languages[lang]) {
    currentLanguage = lang;
    localStorage && localStorage.setItem('lang', lang);
  }
};

const get = () => {
  return currentLanguage;
};

const loadLanguages = (all) => {
  languages = {
    ...languages,
    ...all
  };
};

const updateLanguage = (lang, langName) => {
  languages[langName] = {
    ...languages[langName],
    messages: {
      ...languages[langName].messages,
      ...lang,
    }
  };
};
export {
  translate,
  set,
  get,
  loadLanguages,
  updateLanguage
};