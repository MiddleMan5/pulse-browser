import { Box } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        flexDirection: "row",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function FavoritesPage() {
    const classes = useStyles();

    return <Box className={classes.root}></Box>;
}
