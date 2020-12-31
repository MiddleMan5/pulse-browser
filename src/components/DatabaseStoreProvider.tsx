import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Provider as StoreProvider } from "react-redux";
import { initStore } from "../store";

// Unwrap promise type
type Await<T> = T extends PromiseLike<infer U> ? U : T;

// Waits for redux store to be loaded from database before rendering children
export const DatabaseStoreProvider: React.FC = ({ children }) => {
    const [store, setStore] = useState<Await<ReturnType<typeof initStore>> | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const initializedStore = await initStore();
            setStore(initializedStore);
        })().catch((err) => console.error("Failed to initialize redux store:", err));
    }, []);

    return store == null ? <CircularProgress /> : <StoreProvider store={store}>{children}</StoreProvider>;
};
