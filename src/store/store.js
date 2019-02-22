import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../Redux/reducers/index';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';

let middleware = [thunk];

let saveSubsetBlacklistFilter = createBlacklistFilter(
  'form',
  ['login']
);

let config = {
  key: 'root',
  storage: storage,
  //blacklist: ['form'],
  transforms: [saveSubsetBlacklistFilter]
}

let store = createStore(persistReducer(config, rootReducer), compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__&& window.__REDUX_DEVTOOLS_EXTENSION__()));

let persistor = persistStore(store);

export { store, persistor };
