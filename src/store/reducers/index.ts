import { combineReducers } from "@reduxjs/toolkit";
import { default as settings, actions as settingsActions } from "./settings";
import { default as searches, actions as searchesActions } from "./searches";
import { default as location, actions as locationActions } from "./location";
import { pulseDatabase } from "../database";

// FIXME: Persist redux state in DB
const storage = pulseDatabase.storage;

const rootReducer = combineReducers({
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
export default rootReducer;
