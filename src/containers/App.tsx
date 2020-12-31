import { Box, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React from "react";
import SidePanel from "../components/SidePanel";
import Pages from "./Pages";
import { PulseThemeProvider } from "../components";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
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
    const { theme } = useSelector((state: RootState) => state.settings);
    return (
        <PulseThemeProvider themeName={theme}>
            <Box className={classes.root}>
                <SidePanel />
                <Pages />
            </Box>
        </PulseThemeProvider>
    );
};

export default App;
