import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../Redux/reducers/index';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

let middleware = [thunk];

let config = { key: 'root', storage }

let store = createStore(persistReducer(config, rootReducer), compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__&& window.__REDUX_DEVTOOLS_EXTENSION__()));

let persistor = persistStore(store);

export { store, persistor };
