import { combineReducers } from "@reduxjs/toolkit";
import { default as settings, actions as settingsActions } from "./settings";
import { default as searches, actions as searchesActions } from "./searches";
// import app from "./app";
// import locations from "./locations";
// import taglibrary from "./taglibrary";
// import locationIndex from "./location-index";
import { pulseDatabase } from "../store/PulseDatabase";

// const externalLocations = window.ExtLocations || false;
// const externalTagLibrary = window.ExtTagLibrary || false;

// FIXME: Persist redux state in DB
const storage = pulseDatabase.storage;

const rootReducer = combineReducers({
    settings,
    searches,
});

export const rootActions = {
    settings: settingsActions,
    searches: searchesActions,
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
