import { Box } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import SettingsDialog from "../components/dialogs/settings/SettingsDialog";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        flexDirection: "row",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    setting: {
        width: "100%",
    },
}));

export default function SettingsPanel() {
    const classes = useStyles();
    const [open, setOpen] = useState(true);

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Box className={classes.root}>
            <SettingsDialog open={open} onClose={onClose} />;
        </Box>
    );
}
