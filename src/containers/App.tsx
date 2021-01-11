import { Box, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React from "react";
import SidePanel from "../components/SidePanel";
import Pages from "./Pages";
import { SearchProvider } from "../components/SearchProvider";

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

    return (
        <Box className={classes.root}>
            <SearchProvider />
            <SidePanel />
            <Pages />
        </Box>
    );
};

export default App;
