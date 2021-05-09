import {createStore,combineReducers} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import authReducer from './reducers/authReducer.js';
import userReducer from './reducers/userReducer.js';
const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer
})
const persistConfig = {
    key: 'root',
    storage,
}
   
const persistedReducer = persistReducer(persistConfig, rootReducer)
export let store = createStore(persistedReducer);
export let persistor = persistStore(store);
