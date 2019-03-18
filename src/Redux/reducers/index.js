/********* THIS IS THE ROOT REDUCER *********/
import { combineReducers } from 'redux';
import tempEdgeReducer from './tempEdgeReducer';
import { reducer as formReducer } from 'redux-form';
import { localizeReducer } from 'react-localize-redux';
import { connectRouter } from 'connected-react-router';
import {reducer as notificationsReducer} from 'reapop';

export default (history) => combineReducers({
  router: connectRouter(history),
  notifications: notificationsReducer(),
  tempEdge: tempEdgeReducer,
  localize: localizeReducer,
  form: formReducer
});
/********************************************/
