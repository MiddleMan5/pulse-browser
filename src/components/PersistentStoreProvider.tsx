import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Provider as StoreProvider } from "react-redux";
import { usePouch } from "use-pouchdb";

import { createLogger } from "redux-logger";
import { configureStore, Middleware } from "@reduxjs/toolkit";
import { rootReducer } from "../store";

export class PouchReduxStorage {
    protected db: PouchDB.Database;
    protected docRevs: { [key: string]: any } = {};

    constructor(db: PouchDB.Database) {
        this.db = db;
    }

    protected collectionKey(key: string) {
        return `redux/${key}`;
    }

    async setItem(key: string, value: any) {
        const cKey = this.collectionKey(key);
        const doc = JSON.parse(value);
        const _rev = this.docRevs[cKey];
        const result = await this.db.put(Object.assign({ _id: cKey, _rev }, doc));
        this.docRevs[cKey] = result.rev;
        return result;
    }

    async getItem(key: string) {
        const cKey = this.collectionKey(key);
        const { _id, _rev, ...item } = (await this.db.get(cKey)) as any;
        const doc = item;
        this.docRevs[cKey] = _rev;
        return doc;
    }

    async removeItem(key: string, value: any) {
        const cKey = this.collectionKey(key);
        await this.db.remove({ _id: cKey, _rev: this.docRevs[cKey] });
        delete this.docRevs[cKey];
    }

    async getAllKeys() {
        return Object.keys(this.docRevs);
    }
}

// Load initial state from database and apply middleware
export const initStore = async (db: PouchDB.Database) => {
    // Redux Middleware

    const logger = createLogger({
        level: "info",
        collapsed: true,
    });

    // Store state changes in database

    // TODO: Define this "scheme version" concept better or drop it
    const schemaVersion = 0;
    const dbKey = `${schemaVersion}.state`;
    const storage = new PouchReduxStorage(db);
    const persistor: Middleware = ({ getState }) => {
        return (next) => (action) => {
            const result = next(action);
            storage.setItem(dbKey, JSON.stringify(getState())).catch((err) => console.error(err));
            return result;
        };
    };

    // TODO: Should also provide a clean-slate initial state (with sane defaults)
    const initialState = {};
    try {
        const appState = await storage.getItem(dbKey);
        Object.assign(initialState, appState);
    } catch (ex) {
        console.error("Failed to load initial state from database:", ex);
    }

    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger).concat(persistor),
        preloadedState: initialState,
    });

    // Configure hot reloading

    const rootStoreModulePath = require.resolve("../store/reducers");

    // TODO: Make sure this is the correct way to hot reload reducers
    if (process.env.NODE_ENV === "development" && module?.hot) {
        module.hot.accept(rootStoreModulePath, () => {
            const newRootReducer = require(rootStoreModulePath).default;
            store.replaceReducer(newRootReducer);
        });
    }
    return store;
};

// Unwrap promise type
type Await<T> = T extends PromiseLike<infer U> ? U : T;

// Waits for redux store to be loaded from database before rendering children
export const PersistentStoreProvider: React.FC = ({ children }) => {
    const db = usePouch<{}>();
    const [store, setStore] = useState<Await<ReturnType<typeof initStore>> | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const initializedStore = await initStore(db);
            setStore(initializedStore);
        })().catch((err) => console.error("Failed to initialize redux store:", err));
    }, []);

    if (store == null) {
        return <CircularProgress />;
    } else {
        return <StoreProvider store={store}>{children}</StoreProvider>;
    }
};

export default PersistentStoreProvider;
