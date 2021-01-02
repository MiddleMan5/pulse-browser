import { combineReducers } from "@reduxjs/toolkit";
import { default as settings, actions as settingsActions } from "./settings";
import { default as searches, actions as searchesActions } from "./searches";
import { default as location, actions as locationActions } from "./location";

export const rootReducer = combineReducers({
    settings,
    searches,
    location,
});

export const rootActions = {
    settings: settingsActions,
    searches: searchesActions,
    location: locationActions,
};

export type RootState = ReturnType<typeof rootReducer>;
export type RootActions = typeof rootActions;
export default rootReducer;
