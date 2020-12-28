import { applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "../reducers";
import onlineListener from "../services/onlineListener";
import { configureStore as configureStoreToolkit } from "@reduxjs/toolkit";

const configureStore = (initialState: any) => {
    // Redux Configuration
    const middleware = [];
    const enhancers = [];

    // Thunk Middleware
    middleware.push(thunk);

    // Logging Middleware
    const logger = createLogger({
        level: "info",
        collapsed: true,
    });
    middleware.push(logger);

    // Redux DevTools Configuration
    const actionCreators = {
        // ...routerActions
    };
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
              actionCreators,
          })
        : compose;
    /* eslint-enable no-underscore-dangle */

    // Apply Middleware & Compose Enhancers
    enhancers.push(applyMiddleware(...middleware));
    // enhancers.push(autoRehydrate()); removed in v5
    const enhancer = composeEnhancers(...enhancers);

    // Create Store
    const store = configureStoreToolkit({ reducer: rootReducer, preloadedState: initialState, enhancers: [enhancer] });

    onlineListener(store.dispatch);

    if (module.hot) {
        module.hot.accept(
            "../reducers",
            () => store.replaceReducer(require("../reducers")) // eslint-disable-line global-require
        );
    }

    return { store, persistor: undefined };
};

export default { configureStore };
