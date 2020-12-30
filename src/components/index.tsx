export * from "./ImageCard";
export * from "./ImageCardMenu";
export * from "./ThemeProvider";
import { CircularProgress, Box } from "@material-ui/core";
import loadable from "@loadable/component";
import React from "react";
export { default as DatabasePanel } from "./DatabasePanel";

// lazy-loadable components

// TODO: Add an option to disable loading of
// components using something like this logic:
export const loadForever = async () => {
    // eslint-disable-next-line no-constant-condition
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
