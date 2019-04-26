import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from '../Redux/reducers/index';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { createTransform } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import { routerMiddleware } from 'connected-react-router';
import history from '../history';
import JSOG from 'jsog';    //Circular JSON Structures

                          //For dispatching history actions
let middleware = [thunk, routerMiddleware(history)];

let JSOGTransform = createTransform(
  (inboundState,  key) => JSOG.encode(inboundState),
  (outboundState, key) => JSOG.decode(outboundState),
);

let saveSubsetBlacklistFilter = createBlacklistFilter(
  'form',
  ['login']
);

let config = {
  key: 'root',
  storage: storage,
  //blacklist: ['form'],
  transforms: [saveSubsetBlacklistFilter, JSOGTransform]
}

let store = createStore(persistReducer(config, createRootReducer(history)), compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__&& window.__REDUX_DEVTOOLS_EXTENSION__()));

let persistor = persistStore(store);

export { store, persistor, history, JSOGTransform };
