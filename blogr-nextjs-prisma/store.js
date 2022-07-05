// import { createStore, combineReducers } from 'redux';
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import userReducer from './reducers/userReducer.js';
//
import { createStore, applyMiddleware, compose, combineReducers } from "redux"
import thunk from "redux-thunk"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { createWrapper } from "next-redux-wrapper"

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
export const wrapper = createWrapper(() => store);

// const middleware = [thunk]

// const makeStore = () => createStore(rootReducer, compose(applyMiddleware(...middleware)))

// export const wrapper = createWrapper(makeStore)
// //
// // const rootReducer = combineReducers({
// //     user: userReducer
// // })
// const persistConfig = {
//     key: 'root',
//     storage,
// }
   
// const persistedReducer = persistReducer(persistConfig, rootReducer)
// export let store = createStore(persistedReducer);
// export let persistor = persistStore(store);
