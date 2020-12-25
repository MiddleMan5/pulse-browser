import {
    Box,
    Button,
    ClickAwayListener,
    FormControlLabel,
    FormGroup,
    Grid,
    Grow,
    InputBase,
    Paper,
    Popper,
    Switch,
    TextField,
} from "@material-ui/core";
import { createStyles, fade, makeStyles, Theme } from "@material-ui/core/styles";
import { Search as SearchIcon } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { Image, Query } from "../models";
import { SearchTabBar } from "./SearchTabBar";
import { ImageCard } from "./ImageCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            display: "none",

            [theme.breakpoints.up("sm")]: {
                display: "block",
            },
        },
        search: {
            position: "relative",
            flexGrow: 1,
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(1),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        searchSettings: {
            paddingLeft: theme.shape.borderRadius,
            display: "flex",
        },
        searchBar: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            position: "sticky",
        },
        inputRoot: {
            color: "inherit",
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                width: "12ch",
                "&:focus": {
                    width: "20ch",
                },
            },
        },
        gallery: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        buttonBar: {
            position: "fixed",
        },
    })
);

interface SearchTabProps {
    title?: string;
    value?: Image[];
}

export function SearchTab(props?: SearchTabProps) {
    const classes = useStyles();

    // Searches
    const [pageNum, setPageNum] = useState(1);
    const [queryStr, setQueryStr] = useState("");
    const [query, setQuery] = useState<Query>({});
    const [results, setResults] = useState<Image[]>(props?.value ?? []);
    const [runCount, setRunCount] = useState(0);

    // Initialize Options
    useEffect(() => {
        // TODO: Site-defined search tokens
        const queryTokens = queryStr.split(" ");
        const newQuery = { tags: [...queryTokens], page: pageNum, limit: undefined };
        setQuery(newQuery);
    }, [queryStr, pageNum]);

    // Update query object
    useEffect(() => {
        // TODO: Site-defined search tokens
        const queryTokens = queryStr.split(" ");
        const newQuery = { tags: [...queryTokens], page: pageNum, limit: undefined };
        setQuery(newQuery);
    }, [queryStr, pageNum]);

    // Perform search with current query
    async function performSearch() {
        // Copy current query
        const siteQuery = { ...query };
    }

    // TODO: This is dumb
    function submitSearch() {
        performSearch().catch(console.error);
    }

    // Re-render on result updates
    useEffect(() => {
        console.log("Rendering results...");
    }, [results, runCount]);

    return (
        <Box className={classes.root}>
            <SearchTabBar onSubmit={submitSearch} />
            <Grid
                container
                direction="row-reverse"
                justify="center"
                alignItems="flex-start"
                spacing={2}
                className={classes.gallery}
            >
                {results.map((img) => (
                    <Grid key={img.uri} item>
                        <ImageCard image={img.uri} title={img.uri} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
