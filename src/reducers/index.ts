import { combineReducers } from '@reduxjs/toolkit'
import { default as settings, actions as SettingsActions } from "./settings";
import app from "./app";
import locations from "./locations";
import taglibrary from "./taglibrary";
import locationIndex from "./location-index";
import { pulseDatabase } from "../store/PulseDatabase";

const externalLocations = window.ExtLocations || false;
const externalTagLibrary = window.ExtTagLibrary || false;

console.log(SettingsActions);

// FIXME: Persist redux state in DB
const storage = pulseDatabase.storage;

const rootReducer = combineReducers({
    settings,
    app,
    locations: externalLocations ? () => externalLocations : locations,
    taglibrary: externalTagLibrary ? () => externalTagLibrary : taglibrary,
    locationIndex,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
