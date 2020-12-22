export * from "./ImageCard";
export * from "./ImageCardMenu";
export * from "./ThemeProvider";
import CircularProgress from "@material-ui/core/CircularProgress";
import loadable from "@loadable/component";
import React from "react";

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

export const LoadableTabPanel = loadable(() => import("./TabPanel"), {
    fallback: <DefaultLoadingPlaceholder />,
});
