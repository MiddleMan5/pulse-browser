import { Box, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LocalDatasource, RestDatasource, useDatasource } from "../../datasources";
import { usePulse } from "../../store/database";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
    })
);

export default function SettingsPage() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const pulse = usePulse();
    const local = useDatasource([LocalDatasource.name, RestDatasource.name]);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if (!loading) {
                setLoading(true);
                const collection = pulse.collection("index");
                const docs = await local.find();
                await collection.insert(docs);
            }
        })().catch((err) => console.error(err));
    }, []);

    return (
        <Box className={classes.root}>
            {
                <List>
                    <ListItem>
                        <ListItemText primary={local.name} />
                        <ListItemText primary={local.config.directory} />
                        <ListItemIcon>
                            <local.config.icon />
                        </ListItemIcon>
                    </ListItem>
                </List>
            }
        </Box>
    );
}
