/********* THIS IS THE ROOT REDUCER *********/
import { combineReducers } from 'redux';
import someReducer from './someReducer';
import { localizeReducer } from 'react-localize-redux';

export default combineReducers({
  rootReducer: someReducer,
  localize: localizeReducer
});
/********************************************/
