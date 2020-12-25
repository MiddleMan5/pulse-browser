export * from "./ImageCard";
export * from "./ImageCardMenu";
export * from "./ThemeProvider";
import { CircularProgress, Box } from "@material-ui/core";
import loadable from "@loadable/component";
import React from "react";
export { default as DatabasePanel } from "./DatabasePanel";
export { default as SettingsPanel } from "./SettingsPanel";
export { default as TabPanel } from "./TabPanel";

// lazy-loadable components

// TODO: Add an option to disable loading of
// components using something like this logic:
export const loadForever = async () => {
    while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
};

export const DefaultLoadingPlaceholder = () => {
    return <CircularProgress style={{ marginLeft: "auto", marginRight: "auto" }} />;
};

// TODO: Unit tests? This is really only relevant for testing
export const LoadableForever = loadable(() => loadForever(), {
    fallback: <DefaultLoadingPlaceholder />,
});

// FIXME: This is making development really hard right now

// export const LoadableTabPanel = loadable(() => import(), {
//     fallback: <DefaultLoadingPlaceholder />,
// });

// export const LoadablePulse = loadable(() => import("./Pulse"), {
//     fallback: <DefaultLoadingPlaceholder />,
// });
