import { store } from '../../../store/store';
import { getList, doLogout } from '../../../Redux/actions/tempEdgeActions';
import types from '../../../Redux/actions/types';
import translationsEN from '../../../translations/en.tempedge.json';
import translationsES from '../../../translations/es.tempedge.json';

let addTranslationsForActiveLanguage = async (activeLanguage, addTranslationForLanguage) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Default language while API get the Language
      let translations = translationsEN;
      switch (activeLanguage.code) {
        case 'en':
          translations = translationsEN;
          break;
        case 'es':
          translations = translationsES;
          break;
          default:
      }

      addTranslationForLanguage(translations, activeLanguage.code);

      let state = store.getState();
      if (!state.tempEdge.lang) await store.dispatch(getList('/api/dictionary/listAll', types.GET_LANGUAGE));
      state = store.getState();
      translations = state.tempEdge.lang.english;      //Default to English

      //Can add more languages if ever needed
      switch (activeLanguage.code) {
        case 'en':
          translations = state.tempEdge.lang.english;
          break;
        case 'es':
          translations = state.tempEdge.lang.spanish;
          break;
        default:
      }

      if (!activeLanguage) {
        return;
      }

      addTranslationForLanguage(translations, activeLanguage.code);
      resolve();
    } catch (error) {
      let translations = translationsEN;
      switch (activeLanguage.code) {
        case 'en':
          translations = translationsEN;
          break;
        case 'es':
          translations = translationsES;
          break;
        default:
      }
      // if (!activeLanguage) return;
      addTranslationForLanguage(translations, activeLanguage.code);
      await store.dispatch(doLogout(activeLanguage.code));
      reject('com.tempedge.error.undefine');
    }
  })
}

export default addTranslationsForActiveLanguage;
