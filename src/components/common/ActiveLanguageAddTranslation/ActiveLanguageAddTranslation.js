//Done this way below, there's no delay between laguange text switch
import translationsEN from '../../../translations/en.tempedge.json';
import translationsES from '../../../translations/es.tempedge.json';

let addTranslationsForActiveLanguage = (activeLanguage, addTranslationForLanguage) => {
  let translations = translationsEN;      //Default to English

  //Can add more languages if ever needed
  switch(activeLanguage.code){
    case 'en':
      translations = translationsEN;
      break;
    case 'es':
      translations = translationsES;
      break;
    default:
  }

  if (!activeLanguage) {
    return;
  }

  addTranslationForLanguage(translations, activeLanguage.code);
}

export default addTranslationsForActiveLanguage;
