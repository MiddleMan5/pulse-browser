import { createLogger } from "redux-logger";
import { configureStore, Middleware } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { pulseDatabase } from "./database";
// Logging Middleware
const logger = createLogger({
    level: "info",
    collapsed: true,
});

const dbKey = "applicationState";

const reduxStore = pulseDatabase.storage;
const persistor: Middleware = ({ getState }) => {
    return (next) => (action) => {
        const result = next(action);
        reduxStore
            .setItem(dbKey, JSON.stringify(getState()))
            .then(() => console.log("Db updated"))
            .catch((err) => console.error(err));
        return result;
    };
};

export const initStore = async () => {
    const initialState = {};
    try {
        const appState = await pulseDatabase.storage.getItem(dbKey);
        console.log("appState:", appState);
        Object.assign(initialState, appState);
    } catch (ex) {
        console.error("Failed to load initial state from database:", ex);
    }

    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger).concat(persistor),
        preloadedState: initialState,
    });

    if (process.env.NODE_ENV === "development" && module.hot) {
        module.hot.accept("./reducers", () => {
            const newRootReducer = require("./reducers").default;
            store.replaceReducer(newRootReducer);
        });
    }
    return store;
};
