import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import onlineListener from "../services/onlineListener";
import { configureStore as configureStoreToolkit } from "@reduxjs/toolkit";

const enhancer = compose(
    applyMiddleware(thunk) // , router)
    // autoRehydrate()
);

function configureStore(initialState: any) {
    const store = configureStoreToolkit({ reducer: rootReducer, preloadedState: initialState, enhancers: [enhancer] });
    onlineListener(store.dispatch);
    const persistor = persistStore(
        store
    ); /* , null, () => {
    document.dispatchEvent(new Event('storeLoaded'));
  }); */
    return { store, persistor };
}

export default { configureStore };
