import { store } from '../../../store/store';
import { getList } from '../../../Redux/actions/tempEdgeActions';
import types from '../../../Redux/actions/types';

let addTranslationsForActiveLanguage = async (activeLanguage, addTranslationForLanguage) => {

  let state = store.getState();
  if (!state.tempEdge.lang) await store.dispatch(getList('/api/dictionary/listAll', types.GET_LANGUAGE));
  state = store.getState();
  let translations = state.tempEdge.lang.english;      //Default to English

  //Can add more languages if ever needed
  switch(activeLanguage.code){
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
}

export default addTranslationsForActiveLanguage;
