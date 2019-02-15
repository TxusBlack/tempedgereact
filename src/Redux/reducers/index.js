/********* THIS IS THE ROOT REDUCER *********/
import { combineReducers } from 'redux';
import tempEdgeReducer from './tempEdgeReducer';
import { reducer as formReducer } from 'redux-form';
import { localizeReducer } from 'react-localize-redux';

export default combineReducers({
  tempEdge: tempEdgeReducer,
  localize: localizeReducer,
  form: formReducer
});
/********************************************/
