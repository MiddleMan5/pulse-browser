import { createLogger } from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

// TODO: Get initial state
const initialState = {};

// Logging Middleware
const logger = createLogger({
    level: "info",
    collapsed: true,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    preloadedState: initialState,
});

if (process.env.NODE_ENV === "development" && module.hot) {
    module.hot.accept("./reducers", () => {
        const newRootReducer = require("./reducers").default;
        store.replaceReducer(newRootReducer);
    });
}

export type AppDispatch = typeof store.dispatch;
export default store;
