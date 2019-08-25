import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from '../Redux/reducers/index';
import storageSession from 'redux-persist/lib/storage/session'
import { persistStore, persistReducer } from 'redux-persist';
import { createTransform } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import { routerMiddleware } from 'connected-react-router';
import history from '../history';

                          //For dispatching history actions
let middleware = [thunk, routerMiddleware(history)];

let saveSubsetBlacklistFilter = createBlacklistFilter(
  'form'
  ['login'],
  ['CreateNewAgency', 'CreateNewUser', 'CreateNewClient']
);

let config = {
  key: 'root',
  storage: storageSession,
  blacklist: ['tempEdge', 'form'],
  //transforms: [saveSubsetBlacklistFilter] //[JSOGTransform]
}

let store = createStore(persistReducer(config, createRootReducer(history)), compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__&& window.__REDUX_DEVTOOLS_EXTENSION__()));

let persistor = persistStore(store);

export { store, persistor, history };
