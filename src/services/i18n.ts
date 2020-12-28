import i18n from "i18next";
import XHR from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en/core.json";

function loadLocales(url, options, callback, data) {
    switch (url) {
        default: {
            callback(en, { status: "200" });
            break;
        }
    }
}

const options = {
    fallbackLng: "en",
    // load: 'all', // ['en', 'de'], // we only provide en, de -> no region specific locals like en-US, de-DE
    // ns: ['core'],
    // defaultNS: 'core',
    attributes: ["t", "i18n"],
    backend: {
        loadPath: "{{lng}}",
        parse: (data) => data, // comment to have working i18n switch
        ajax: loadLocales, // comment to have working i18n switch
    },
    // getAsync: true,
    // debug: true,
    /* interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: (value, format) => {
      if (format === 'uppercase') return value.toUpperCase();
      return value;
    }
  } */
};

i18n.use(XHR)
    .use(LanguageDetector)
    .init(options, (err, t) => {
        // i18n.use(XHR).init(options, (err, t) => {
        if (err) {
            return console.log("something went wrong loading", err);
        }
    });

export default i18n;
