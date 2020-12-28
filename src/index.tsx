import React from "react";
import { render } from "react-dom";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "./components/PersistGate";
import LoadingScreen from "./components/LoadingScreen";
import { actions as AppActions } from "./reducers/app";
import { getDefaultLocationId } from "./reducers/locations";
import {
    actions as SettingsActions,
    getCheckForUpdateOnStartup,
    isFirstRun,
    isGlobalKeyBindingEnabled,
} from "./reducers/settings";
import PlatformIO from "./services/platform-io";
import { FileSystemEntry, getAllPropertiesPromise } from "./services/utils-io";
// import MainPage from './MainPage';
import { getURLParameter } from "./utils/misc";
import App from "./containers/App";
import configureStore from "./store/configureStore";

const { store, persistor } = configureStore({});

// Actions to perform after loading store, but before loading app
function onBeforeLift(store: any) {
    // store.dispatch(SettingsActions.upgradeSettings()); // TODO call this only on app version update
    const state = store.getState();

    console.log("State:", state);
    // store.dispatch(SettingsActions.setCurrentTheme('dark'));

    const defaultLocationId = getDefaultLocationId(state);
    if (defaultLocationId && defaultLocationId.length > 0) {
        store.dispatch(AppActions.openLocationById(defaultLocationId));
    }

    if (isFirstRun(state)) {
        store.dispatch(AppActions.toggleOnboardingDialog());
    }

    // PlatformIO.setGlobalShortcuts(isGlobalKeyBindingEnabled(state));

    const langURLParam = getURLParameter("locale");
    if (langURLParam && langURLParam.length > 1 && /^[a-zA-Z\-_]+$/.test("langURLParam")) {
        store.dispatch(SettingsActions.setLanguage(langURLParam));
    }

    // const openParam = getURLParameter("open");
    // if (openParam && openParam.length > 1) {
    //     // dispatch toggle full width
    //     setTimeout(() => {
    //         getAllPropertiesPromise(decodeURIComponent(openParam))
    //             .then((fsEntry: FileSystemEntry) => {
    //                 store.dispatch(AppActions.openFsEntry(fsEntry));
    //                 return true;
    //             })
    //             .catch((error) => console.warn("Error getting properties for entry: " + openParam + " - " + error));
    //         // store.dispatch(AppActions.openFile(decodeURIComponent(openParam)));
    //         store.dispatch(AppActions.setEntryFullWidth(true));
    //     }, 1000);
    // }
}

render(
    <StoreProvider store={store}>
        <PersistGate loading={<LoadingScreen />} onBeforeLift={() => onBeforeLift(store)} persistor={persistor}>
            <App />
        </PersistGate>
    </StoreProvider>,
    document.getElementById("root")
);
