export * from "./ImageCard";
export * from "./ImageCardMenu";
export * from "./ThemeProvider";
import CircularProgress from "@material-ui/core/CircularProgress";
import loadable from "@loadable/component";
import React from "react";

// Lazy loading

export const LoadableTabPanel = loadable(() => import("./TabPanel"), {
    fallback: <CircularProgress />,
});
