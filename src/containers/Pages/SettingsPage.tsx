import { Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexGrow: 1,
            flexDirection: "row",
            width: "100%",
            backgroundColor: theme.palette.background.paper,
        },
        setting: {
            width: "100%",
        },
    })
);

export default function SettingsPage() {
    const classes = useStyles();
    const [open, setOpen] = useState(true);

    const onClose = () => {
        setOpen(false);
    };

    return <Box className={classes.root}></Box>;
}
