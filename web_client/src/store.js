import {createStore,combineReducers} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import userReducer from './reducers/userReducer.js';
const rootReducer = combineReducers({
    user: userReducer
})
const persistConfig = {
    key: 'root',
    storage,
}
   
const persistedReducer = persistReducer(persistConfig, rootReducer)
export let store = createStore(persistedReducer);
export let persistor = persistStore(store);
