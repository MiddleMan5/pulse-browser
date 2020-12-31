import { CssBaseline, Container, Box, Theme } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import React from "react";
import { useSelector } from "react-redux";
import { PulseThemeProvider } from "../components";
import { RootState } from "../store/reducers";

import SidePanel from "../components/SidePanel";
import Pages from "./Pages";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        layoutRoot: {
            display: "flex",
            height: "100vh",
            width: "100vw",
            flexDirection: "row",
            alignItems: "stretch",
        },
    })
);

const App: React.FC = () => {
    const classes = useStyles();
    const { currentTheme } = useSelector((state: RootState) => state.settings);

    return (
        <Box className={classes.root}>
            <PulseThemeProvider themeName={currentTheme}>
                <CssBaseline />
                <Box className={classes.layoutRoot}>
                    <SidePanel />
                    <Pages />
                </Box>
            </PulseThemeProvider>
        </Box>
    );
};

export default App;
