import { Box, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React, { useEffect } from "react";
import { useCollection } from "../store/database";
import { useDispatch, useSelector } from "react-redux";
import { rootActions, RootState } from "../store";

import { ipcService } from "../services/ipc.service";
import { AnyObject } from "../models";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
    })
);

export const SearchProvider: React.FC = ({ children }) => {
    const classes = useStyles();
    const [indexRows, indexLoading, indexError, index] = useCollection("index");
    const [tagsRows, tagsLoading, tagsError, tags] = useCollection("tags");
    const dispatch = useDispatch();
    const { updateSearch } = rootActions.searches;
    const searches = useSelector((state: RootState) => state.searches.entities);

    useEffect(() => {
        for (const id in searches) {
            const search = searches[id]!;
            console.log("Beginning search:", id);
            ipcService
                .send("searchImages", search.query)
                .then(async (value) => {
                    if (Array.isArray(value)) {
                        await index.insert(value);
                    } else {
                        console.error("Unexpected value:", value);
                    }
                })
                .catch((err) => console.error("Failed to search images:", err));
        }
        ipcService
                .send("loadTags")
                .then(async (value) => {
                    if (Array.isArray(value)) {
                        await tags.insert(value);
                    } else {
                        console.error("Unexpected value:", value);
                    }
                })
                .catch((err) => console.error("Failed to search images:", err));
    }, [searches]);

    return <Box className={classes.root}>{children}</Box>;
};
